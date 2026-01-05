# Portfolio VM + Nginx Static Site + Cloudflare Tunnel — Setup README

This README documents how to set up an Ubuntu 24.04 LTS VM on Proxmox, harden it as a basic web server, host a static site with Nginx (including React/Vite SPA support and caching headers), and expose it to the internet securely using a Cloudflare Tunnel (`cloudflared`), with DNS managed by Cloudflare.

---

## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [0. Create Ubuntu VM on Proxmox](#0-create-ubuntu-vm-on-proxmox)
* [1. Base Server Setup + Security](#1-base-server-setup--security)
* [2. Install and Configure Nginx for Static Site Hosting](#2-install-and-configure-nginx-for-static-site-hosting)
* [3. Cloudflare DNS Setup](#3-cloudflare-dns-setup)
* [4. Install + Authenticate `cloudflared` (Cloudflare Tunnel)](#4-install--authenticate-cloudflared-cloudflare-tunnel)
* [5. Create and Configure a Cloudflare Tunnel](#5-create-and-configure-a-cloudflare-tunnel)
* [6. Run Tunnel as a Persistent System Service](#6-run-tunnel-as-a-persistent-system-service)
* [7. Add Caching Headers for Vite/React Build Output](#7-add-caching-headers-for-vitereact-build-output)
* [8. GitHub Actions Runner (Self-Hosted) + Automated Deploy](#8-github-actions-runner-self-hosted--automated-deploy)
* [Troubleshooting](#troubleshooting)

---

## Overview

### What this setup achieves

✅ Runs an Ubuntu 24.04 LTS VM on Proxmox

✅ Hosts a static website via Nginx

✅ Supports React/Vite SPA routing (fallback to `index.html`)

✅ Hardened with `ufw` firewall + unattended security updates

✅ Public access via Cloudflare Tunnel (no port forwarding required)

✅ DNS + HTTPS handled by Cloudflare edge

---

## Prerequisites

* Proxmox host installed and reachable
* Ubuntu 24.04 LTS ISO available in Proxmox
* Domain registered (e.g. Namecheap)
* Cloudflare account with domain added
* Local router access (for Static DHCP configuration)

---

## 0. Create Ubuntu VM on Proxmox

Created a **Ubuntu 24.04 LTS VM** on Proxmox with:

* **VM name:** `portfolio`
* **CPU:** 4 cores, 1 thread
* **RAM:** 4.00 GiB
* **Disk:** 32.00 GiB SSD
* **OpenSSH installed** during Ubuntu install

Guides used:

* Proxmox VM creation:
  [https://www.starwindsoftware.com/blog/first-virtual-machine-in-proxmox/](https://www.starwindsoftware.com/blog/first-virtual-machine-in-proxmox/)
* VM configuration guide:
  [https://patrickpriestley.com/blog/how-to-create-vm-in-proxmox/#related-guides](https://patrickpriestley.com/blog/how-to-create-vm-in-proxmox/#related-guides)


To make the VM reachable reliably on the LAN, assigned a **static DHCP lease** via the router:

1. Open router UI: `http://192.168.1.1`
2. Enable **Expert mode**
3. Go to:

   * **Settings**
   * **Static DHCPv4 - Local Network**
4. Select the VM device (by hostname/MAC)
5. Apply changes

✅ Result: VM static local IP becomes: `192.168.1.30`

---

## 1. Base Server Setup + Security

Run the following on the VM:

```bash
sudo apt update
sudo apt -y upgrade
sudo apt -y install curl wget git rsync unzip ca-certificates ufw
sudo reboot

sudo ufw allow OpenSSH
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
sudo ufw status verbose

sudo apt -y install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

timedatectl
sudo timedatectl set-timezone Europe/London
sudo reboot
```

### What this does

* Updates packages
* Installs common server tools
* Enables firewall with only SSH open
* Enables unattended security upgrades
* Sets timezone to Europe/London

---

## 2. Install and Configure Nginx for Static Site Hosting

### 2.1 Install Nginx

Follow the official Nginx Ubuntu install instructions:
[https://nginx.org/en/linux_packages.html#Ubuntu](https://nginx.org/en/linux_packages.html#Ubuntu)

### 2.2 Start Nginx + enable it at boot

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

### 2.3 Create site directory

```bash
sudo mkdir -p /var/www/my-site
sudo chown -R $USER:$USER /var/www/my-site
sudo chmod -R 755 /var/www/my-site
```

### 2.4 Create a test HTML page

```bash
cat > /var/www/my-site/index.html <<'EOF'
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>my-site is live</title>
  </head>
  <body style="font-family: sans-serif;">
    <h1>Nginx is serving my-site</h1>
    <p>If you can see this, Nginx is configured correctly.</p>
  </body>
</html>
EOF
```

### 2.5 Create Nginx config for the site

Edit:

```bash
sudo nano /etc/nginx/conf.d/my-site.conf
```

Paste:

```nginx
server {
    listen 80;
    listen [::]:80;

    # For now, serve on any hostname or IP
    server_name _;

    root /var/www/my-site;
    index index.html;

    # React SPA routing:
    # if a file isn't found, serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 2.6 Disable default config + reload

```bash
sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
sudo nginx -t
sudo nginx -s reload
```

### 2.7 Allow HTTP through firewall

```bash
sudo ufw allow 80/tcp
sudo ufw status verbose
```

✅ You should now be able to access the test page on your LAN at:

* `http://192.168.1.30`

---

## 3. Cloudflare DNS Setup

Ensure Cloudflare is controlling the domain:

1. In your domain registrar (Namecheap), set nameservers to Cloudflare-provided nameservers
2. In Cloudflare dashboard, confirm your domain is active and DNS is managed there

### Migration plan

* `bhavymetakar.com` and `www.bhavymetakar.com` currently point to the old website
* For smooth migration:

  * first point `new.bhavymetakar.com` to the new tunnel/site
  * then move `bhavymetakar.com` and `www` later

Tunnel DNS mapping will be:

`new.bhavymetakar.com -> <tunnel-id>.cfargotunnel.com` (proxied / orange cloud)

---

## 4. Install + Authenticate `cloudflared` (Cloudflare Tunnel)

### 4.1 Install cloudflared

Use official Cloudflare install instructions for Ubuntu Noble (24.04):
[https://pkg.cloudflare.com/index.html#ubuntu-noble](https://pkg.cloudflare.com/index.html#ubuntu-noble)

Verify:

```bash
cloudflared --version
```

### 4.2 Authenticate cloudflared

```bash
cloudflared tunnel login
```

This opens a browser prompt. After successful login, verify that the certificate file exists:

```bash
ls -la ~/.cloudflared
```

✅ You should see `cert.pem`.

---

## 5. Create and Configure a Cloudflare Tunnel

Follow guide step 3 onward:
[https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/)

### 5.1 Create tunnel + get UUID

(Example — actual create command depends on your tunnel name.)

You should end up with:

* a tunnel UUID
* a JSON credentials file: `~/.cloudflared/<UUID>.json`

### 5.2 Create tunnel config file

```bash
nano ~/.cloudflared/config.yml
```

Paste:

```yml
tunnel: <YOUR_TUNNEL_UUID>
credentials-file: /home/portfolio/.cloudflared/<YOUR_TUNNEL_UUID>.json

ingress:
  - hostname: new.bhavymetakar.com
    service: http://localhost:80
  - service: http_status:404
```

### 5.3 Create the DNS record in Cloudflare

```bash
cloudflared tunnel route dns portfolio-new new.bhavymetakar.com
```

✅ Confirm in Cloudflare dashboard that:

* `new.bhavymetakar.com` exists as a **CNAME**
* it points to `*.cfargotunnel.com`
* it is **Proxied** (orange cloud)

### 5.4 Test the tunnel manually

```bash
cloudflared tunnel run portfolio
```

Then open (from anywhere on the internet):

* `https://new.bhavymetakar.com`

---

## 6. Run Tunnel as a Persistent System Service

Stop the manual tunnel (`Ctrl+C`) first.

Guide:
[https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/linux/](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/linux/)

### 6.1 Copy config + credentials into `/etc/cloudflared`

```bash
sudo mkdir -p /etc/cloudflared
sudo cp ~/.cloudflared/config.yml /etc/cloudflared/config.yml
sudo cp ~/.cloudflared/*.json /etc/cloudflared/
```

### 6.2 Update credentials path in `/etc/cloudflared/config.yml`

```bash
sudo nano /etc/cloudflared/config.yml
```

Change:

```yml
credentials-file: /home/portfolio/.cloudflared/<UUID>.json
```

to:

```yml
credentials-file: /etc/cloudflared/<UUID>.json
```

### 6.3 Lock down permissions

```bash
sudo chmod 600 /etc/cloudflared/*.json
sudo chmod 644 /etc/cloudflared/config.yml
```

### 6.4 Install cloudflared as a system service

```bash
sudo cloudflared service install
```

### 6.5 Enable + start service

```bash
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared --no-pager
```

✅ Tunnel should now be persistent and auto-start on boot.

---

## 7. Add Caching Headers for Vite/React Build Output

This step improves performance by caching fingerprinted build assets for a long time, while ensuring `index.html` is always fresh.

### 7.0 Confirm site root + config paths

* Site root: `/var/www/my-site`
* Config: `/etc/nginx/conf.d/my-site.conf`

Confirm:

```bash
ls -la /etc/nginx/conf.d/
```

### 7.1 Backup your existing config

```bash
sudo cp /etc/nginx/conf.d/my-site.conf /etc/nginx/conf.d/my-site.conf.bak
```

### 7.2 Replace config with caching-enabled version

Edit:

```bash
sudo nano /etc/nginx/conf.d/my-site.conf
```

Replace contents with:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/my-site;
    index index.html;

    # 1) Cache-busted build assets (Vite typically outputs to /assets/)
    # Cache for 1 year + immutable because filenames change when content changes.
    location ^~ /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 2) Common static file types: cache long (safe if filenames are hashed)
    location ~* \.(?:js|css|mjs|map|json|png|jpg|jpeg|gif|svg|ico|webp|avif|woff2?|ttf|otf)$ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 3) index.html should update quickly (don't let browsers “stick” to an old app shell)
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-cache";
    }

    # 4) SPA routing: serve files if they exist, otherwise fall back to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 7.3 (Optional) Enable gzip compression

Inside the same `server { ... }` block, add:

```nginx
gzip on;
gzip_min_length 256;
gzip_types
  text/plain
  text/css
  application/javascript
  application/json
  application/xml
  image/svg+xml;
gzip_vary on;
```

### 7.4 Test + apply config

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 7.5 Verify headers

Check `index.html` (should be `no-cache`):

```bash
curl -I http://localhost/index.html
```

Once real Vite assets exist in `/var/www/my-site/assets/`, pick a file:

```bash
ls -la /var/www/my-site/assets | head
curl -I http://localhost/assets/<PASTE_FILENAME_HERE>
```

Expected:

* `Cache-Control: public, max-age=31536000, immutable`
* `Expires:` header set ~1 year

### 7.6 Important caching note

This assumes assets are fingerprinted (Vite default).

✅ Fingerprinted assets (e.g., `app.8f3c2d.js`) → long cache + immutable
✅ `index.html` → no-cache / fast refresh

If you ever have **non-hashed filenames** (e.g., `app.js`), do **not** cache those for a year.

---



## 8. GitHub Actions Runner (Self-Hosted) + Automated Deploy

This section adds CI/CD so every push to your repo can deploy your built site onto the VM.

### 8.1 Create Linux user for runner

Create a dedicated user:

```bash
sudo adduser github-runner
sudo usermod -aG sudo github-runner
```

Create runner directory and ensure ownership:

```bash
sudo mkdir -p /home/github-runner/actions-runner
sudo chown -R github-runner:github-runner /home/github-runner
```

### 8.2 Install runner binaries and register runner

Switch into runner user:

```bash
sudo -iu github-runner
cd /home/github-runner/actions-runner
```

Download the runner version shown on GitHub’s “Add runner” instructions (example only):

```bash
# example only — use the URL and version GitHub shows you
curl -o actions-runner-linux-x64-2.330.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.330.0/actions-runner-linux-x64-2.330.0.tar.gz

tar xzf actions-runner-linux-x64-2.330.0.tar.gz
```

Configure runner using the command GitHub gives you, for example:

```bash
./config.sh --url https://github.com/<ORG_OR_USER>/<REPO> --token <TOKEN>
```

### 8.3 Install runner as a system service

From inside the runner directory:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

### 8.4 Configure passwordless sudo for runner 

Allow runner to run specific commands without password by creating a sudoers entry:

```bash
sudo visudo -f /etc/sudoers.d/github-runner
```

Paste:

```text
github-runner ALL=(ALL) NOPASSWD: /usr/bin/rsync, /bin/systemctl reload nginx, /bin/systemctl restart nginx, /usr/bin/nginx, /bin/mkdir, /bin/chown, /bin/chmod, /bin/rm, /usr/bin/cp
```

Save and exit.

### 8.5 Fix “permission denied” when `cd` or deploying

If you ran runner steps as `portfolio` or `root`, the runner user may not be able to access folders.

### Fix runner directory permissions
Ensure runner owns its home:

```bash
sudo chown -R github-runner:github-runner /home/github-runner
sudo chmod -R u+rwX /home/github-runner
```

### Fix site directory permissions for deployment
Recommended production approach:

- Keep `/var/www/my-site` owned by `root:www-data`
- Allow runner to deploy via `sudo rsync` + `sudo chown`

Example fix:

```bash
sudo chown -R root:www-data /var/www/my-site
sudo chmod -R 755 /var/www/my-site
```

Then in your deploy step, use:

```bash
sudo rsync -av --delete dist/ /var/www/my-site/
sudo chown -R root:www-data /var/www/my-site
sudo chmod -R 755 /var/www/my-site
sudo systemctl reload nginx
```

## 8.6 Verify runner status + common svc.sh confusion

### Important rule:
You must run `svc.sh` from the runner directory.

So this fails (your example) because you’re in `/root`:

`/home/github-runner/actions-runner/svc.sh status`
→ `Failed: Must run from runner root or install is corrupt`

This is expected.

✅ Correct command:

```bash
cd /home/github-runner/actions-runner
sudo ./svc.sh status
```

### Your status output
Your systemd output shows:

- `Active: active (running)`
- `√ Connected to GitHub`
- Runner version `2.330.0`

That means it’s working.

## 8.7 Example GitHub Actions workflow (build + deploy)

Create: `.github/workflows/deploy.yml`

```yml
name: Deploy Portfolio

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: self-hosted

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Nginx root
        run: |
          sudo rsync -av --delete dist/ /var/www/my-site/
          sudo chown -R root:www-data /var/www/my-site
          sudo chmod -R 755 /var/www/my-site
          sudo nginx -t
          sudo systemctl reload nginx
```



---

## Troubleshooting

### Nginx config fails to reload

Run:

```bash
sudo nginx -t
```

Fix syntax errors, then:

```bash
sudo systemctl reload nginx
```

### Site not reachable internally

Check firewall:

```bash
sudo ufw status verbose
```

Ensure port 80 is allowed:

```bash
sudo ufw allow 80/tcp
```

### Tunnel DNS not working

* Confirm CNAME exists in Cloudflare DNS
* Ensure it is **proxied**
* Check tunnel service:

```bash
sudo systemctl status cloudflared --no-pager
sudo journalctl -u cloudflared -n 100 --no-pager
```




### Public media (images, videos, PDFs) not showing

This is a classic Vite + deployment issue: the files in `public/` only get served if they end up inside your built output (usually `dist/`) AND your site is referenced correctly.

**onfirm the files are actually on the server**

After deploy, verify that the assets exist in `/var/www/my-site`:

```bash
ls -la /var/www/my-site
ls -la /var/www/my-site/* | head -n 50
```

If your `public/` files were copied correctly, you should see them in `dist/` locally and then on the server.

**Important:** Vite copies `public/` into the build output root (not `/assets/`) preserving paths.

Example:  
`public/resume.pdf` becomes:  
`/resume.pdf` in production.

So your link should be `/resume.pdf`, not `/public/resume.pdf`.

**Use correct paths in React/Vite**

Correct:

- `<img src="/images/photo.png" />`
- `<a href="/resume.pdf">Resume</a>`
- `<video src="/videos/demo.mp4" />`

Incorrect:

- `/public/...`
- relative `public/...`
- importing large videos/PDFs in JS without copying

**Verify Nginx can serve those file types**

If media still doesn’t load, confirm the file exists and returns 200:

```bash
curl -I http://localhost/resume.pdf
curl -I http://localhost/images/<your-image>.png
```

If 404, the file isn’t deployed to `/var/www/my-site`.

**If you’re using a non-root base path**

If your Vite config uses `base: "/something/"`, then all assets will be under that prefix.
Make sure your references match.

In `vite.config.ts` you might have:

```ts
export default defineConfig({
  base: "/",
})
```

For your case (root domain), `base: "/"` is usually correct.

**Cloudflare caching gotcha**

If you fixed paths but still see old results, purge Cloudflare cache:
Cloudflare Dashboard → Caching → Purge Everything (or purge specific URLs).



### Cloudflare tunnel issues
```bash
sudo systemctl status cloudflared --no-pager
sudo journalctl -u cloudflared -n 200 --no-pager
```

### GitHub runner issues
```bash
cd /home/github-runner/actions-runner
sudo ./svc.sh status
sudo journalctl -u actions.runner.* -n 200 --no-pager
```

Common fixes:
- Ensure runner is executed from its directory
- Ensure `github-runner` owns `/home/github-runner`
- Ensure Actions job has passwordless sudo for needed commands


### Security Notes

- No inbound ports required on your router (tunnel is outbound)
- Keep UFW locked down:
  - allow `OpenSSH`
  - allow `80/tcp` (needed for local Nginx)
- Recommended:
  - SSH keys only
  - disable password login
  - minimal sudo permissions for runner (NOPASSWD for only required commands)
  - regularly update the VM (unattended-upgrades enabled)

---