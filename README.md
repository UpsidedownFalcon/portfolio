# Portfolio 

My component portfolio with **Vite**, **React**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** and **Framer Motion**.  


---

## Tech Stack

- **Vite** — fast local dev + optimized production builds
- **React + TypeScript** — component-driven UI with type safety
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — prebuilt accessible UI primitives (buttons, cards, dialogs, etc.)
- **Framer Motion** — scroll + entrance animations
- **lucide-react** — icon set

---

## Project Structure

```txt
.
├── public/                      # static media assets  
│   ├── images/
│   ├── videos/
│   └── Curriculum Vitae_BhavyM.pdf
│
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives (buttons, cards, dialogs, etc.)
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── ConstellationBackground.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx
│   │   ├── PortfolioSection.tsx
│   │   └── SkillsSection.tsx
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx       # responsive helpers
│   │   └── use-toast.ts         # toast hook (shadcn/ui)
│   │
│   ├── lib/
│   │   └── utils.ts             # utility helpers (cn(), etc.)
│   │
│   ├── pages/
│   │   ├── Index.tsx            # main routed page
│   │   └── NotFound.tsx         # fallback page
│   │
│   ├── App.tsx                  # app shell (routes/layout)
│   ├── main.tsx                 # React entrypoint
│   ├── App.css
│   ├── index.css
│   └── vite-env.d.ts
│
├── index.html                   # Vite HTML template (meta tags, root div)
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
└── components.json              # shadcn/ui generator config

```


## 1) Rendering + Routing

- `index.html` contains the `<div id="root"></div>` mount point.
- `src/main.tsx` bootstraps React and mounts `<App />`.
- `src/App.tsx` defines the top-level layout and routing.
- `src/pages/Index.tsx` is the main page composition (Hero → About → Skills → Portfolio → Contact → Footer).
- `src/pages/NotFound.tsx` handles unknown routes.

---

## 2) Sections

Each section is a standalone component under `src/components/`: 

- `ConstellationBackground.tsx` - interactive constellation background 
- `Navbar.tsx` - navigation bar at the top of the page 
- `NavLink.tsx` - nicer `<NavLink />` component
- `HeroSection.tsx` - landing hero + CTA button + “scroll” chevrons  
- `AboutSection.tsx` - image + bio + skills grid  
- `HonoursAwardsSection.tsx` - patents + publications + media + awards 
- `PortfolioSection.tsx` - some projects 
- `ContactSection.tsx` - contact CTA buttons   
- `Footer.tsx` — footer 

---

## 3) UI System (`src/components/ui`)

This folder contains the **shadcn/ui** primitives that power styling + accessibility.

---

## 4) Animation

Using **Framer Motion** for:

- entrance animations on scroll (`whileInView`)
- staggered card reveals
- subtle looping effects (e.g., scroll chevrons, background effects)

## 5) Styling 

- Using **Tailwind** configured in `tailwind.config.ts` 
- Global styles in `src/index.css` 




==============================================================



0) Created a Ubuntu 24.04 LTS VM on Proxmox w/ 
	- called portfolio 
	- 4 CPU cores on 1 thread 
	- 4.00 GiB of memory 
	- 32.00 GiB of SSD 
	- OpenSSH installed 

using guide: https://www.starwindsoftware.com/blog/first-virtual-machine-in-proxmox/

configured using guide: https://patrickpriestley.com/blog/how-to-create-vm-in-proxmox/#related-guides 

Then assigned a static DHCPv4 local IP to the newly-created VM (figured out by meself): 
	- logged into home router @ 192.168.1.1 
	- go into expert mode 
	- go into settings 
	- under "Static DHCPv4 - Local Network" 
	- select the device 
	- apply changes 
	=> static DHCP-assigned local IP = 192.168.1.30 

1) Server setup w/ 

	```
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

2) Installing and configuring NginX for static site hosting 

guide to installing nginx: https://nginx.org/en/linux_packages.html#Ubuntu

starting nginx and enabling it to start automatically at boot: 

	``` 
		sudo systemctl start nginx 
		sudo systemctl enable nginx 
		sudo systemctl status nginx 
	```

making directory for site files: 

	``` 
		sudo mkdir -p /var/www/my-site
		sudo chown -R $USER:$USER /var/www/my-site
		sudo chmod -R 755 /var/www/my-site
	```

make a test html site served by Nginx: 
	```
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

make config files for the test html site by first going to: 
	``` 
		sudo nano /etc/nginx/conf.d/my-site.conf
	```
and saving and exiting after pasting: 
	```
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

disable default configuration, test syntax and reload: 
	```
		sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled
		sudo nginx -t
		sudo nginx -s reload
	```

enable HTTP through ufw firewall: 
	```
		sudo ufw allow 80/tcp
		sudo ufw status verbose
	```
now HTML test page should be reachable by any device on the network at http://VM-local-ip

3) Cloudflare DNS 
- ensure cloudlfare nameserver on domain registrar (namecheap) 
- ensure cloudflare is being used for its DNS 
- and cloudflare's DNS goes through its proxied tunnel 
- to the web page it should be serving 
- currently, bhavymetakar.com and www.bhavymetakar.com point to the old website 
- so first will point new.bhavymetakar.com to new website 
- then point the old ones to the new website as well 
- for smooth migration 
- cloudflare tunnel will work as follows: 

new.bhavymetakar.com -> <tunnel-id>.cfargotunnel.com (proxied)

4) Installing and authenticating cloudflared on the VM (for cloudflare tunnel) 
guide to installing cloudflared on VM: https://pkg.cloudflare.com/index.html#ubuntu-noble 
verifying cloudflared install through `cloudflared --version`

authenticate cloudflared for cloudflare tunnel creation 
	```
		cloudflared tunnel login
	```

verify account certificate file generated 
	```
		ls -la ~/.cloudflared
	```
to find a `cert.pem` file

5) cloudflare tunnel creation 

guide step 3 and onwards: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/

create config file 
	```
		nano ~/.cloudflared/config.yml

	```
and inside the config file write: 
	```
		tunnel: <YOUR_TUNNEL_UUID>
		credentials-file: /home/portfolio/.cloudflared/<YOUR_TUNNEL_UUID>.json

		ingress:
		  - hostname: new.bhavymetakar.com
		    service: http://localhost:80
		  - service: http_status:404
	```

make the DNS record for new.bhavymetakar.com
	```
		cloudflared tunnel route dns portfolio-new new.bhavymetakar.com
	```
and verify that the DNS record exists on cloudflare as a CNAME with an orange proxy for the cloudflare tunnel 

test the cloudflare tunnel 
	```
		cloudflared tunnel run portfolio 
	```
and open https://new.bhavymetakar.com on any browser with internet access outside the LAN 

6) keeping the cloudflare tunnel always on 
first, stop the previous `cloudflared tunnel run portfolio` using Ctrl+C
guide: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/linux/

we need to change the path of the config files. first copy them over to the default expected path by cloudflared being run as a service 
	```
		sudo mkdir -p /etc/cloudflared
		sudo cp ~/.cloudflared/config.yml /etc/cloudflared/config.yml
		sudo cp ~/.cloudflared/*.json /etc/cloudflared/
	```

then edit the path in `/etc/cloudflared/config.yml` from `credentials-file: /home/portfolio/.cloudflared/<UUID>.json` to `credentials-file: /etc/cloudflared/<UUID>.json
` using
	```
		sudo nano /etc/cloudflared/config.yml
	```

lock down permissions 
	```
		sudo chmod 600 /etc/cloudflared/*.json
		sudo chmod 644 /etc/cloudflared/config.yml
	```

install cloudflared as a service 
	```
		sudo cloudflared service install
	```

then enable + start it and verify 
	```
		sudo systemctl enable --now cloudflared
		sudo systemctl status cloudflared --no-pager
	```

=========

Step 7A — Create a dedicated Linux user for the runner

Running the runner as its own user reduces blast radius (GitHub also emphasizes security risks with self-hosted runners). 
GitHub Docs
+1

7A.1 Create github-runner user
sudo adduser --disabled-password --gecos "" github-runner

7A.2 Give it access to your web root (so it can deploy your build)

We’ll make the runner able to write to /var/www/my-site.

sudo usermod -aG www-data github-runner
sudo chown -R root:www-data /var/www/my-site
sudo chmod -R 775 /var/www/my-site


(That matches what you already did earlier for group-based permissions.)

Step 7B — Install the GitHub Actions runner under that user

We’ll follow the exact process GitHub documents: download → verify hash → extract → config. 
GitHub Docs

7B.1 Switch to the runner user
sudo -iu github-runner


Now you’re in /home/github-runner.

7B.2 Download and extract (your GitHub-provided commands)
mkdir -p actions-runner
cd actions-runner

curl -o actions-runner-linux-x64-2.330.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.330.0/actions-runner-linux-x64-2.330.0.tar.gz

echo "af5c33fa94f3cc33b8e97937939136a6b04197e6dadfcfb3b6e33ae1bf41e79a  actions-runner-linux-x64-2.330.0.tar.gz" | shasum -a 256 -c

tar xzf ./actions-runner-linux-x64-2.330.0.tar.gz


✅ Source: These exact steps are what GitHub provides in “Add self-hosted runner” and are consistent with the official runner setup flow. 
GitHub Docs

Step 7C — Configure the runner (register it to your repo)

⚠️ Use a new token from GitHub (since you posted the old one).
GitHub explicitly says the token is time-limited and used by config.sh to register the runner. 
GitHub Docs

7C.1 Run config

From inside /home/github-runner/actions-runner:

./config.sh --url https://github.com/UpsidedownFalcon/portfolio --token <NEW_TOKEN_FROM_GITHUB>


During the prompts:

Runner group: press Enter (Default)

Runner name: you can set something like portfolio-vm

Labels: keep default, or add portfolio,ubuntu

Work folder: press Enter (Default _work)

✅ Source: GitHub describes config.sh requiring --url and a time-limited token to register. 
GitHub Docs

Step 7D — Install the runner as a systemd service (this is what keeps it running)

GitHub’s official docs: after configuration, use svc.sh to install/manage the runner as a service on Linux systemd. 
GitHub Docs
+1

7D.1 Exit back to your normal user (or keep shell open)

You can keep the github-runner shell, but svc.sh needs sudo.

From the runner directory:

exit


Now go to the runner directory and run:

cd /home/github-runner/actions-runner
sudo ./svc.sh install github-runner
sudo ./svc.sh start


✅ Source: GitHub docs on configuring the runner as a service using svc.sh. 
GitHub Docs
+1

7D.2 Confirm service status
sudo ./svc.sh status


✅ Source: Same GitHub docs section for managing the service. 
GitHub Docs
+1

Step 7E — Confirm GitHub sees your runner

In GitHub:
Repo → Settings → Actions → Runners

You should see it listed as Idle.

✅ Source: GitHub “Self-hosted runners” concept + management pages describe that runners appear and take jobs when online. 
GitHub Docs
+1

Step 8 — Create your deploy workflow (runs on the self-hosted runner)

Now we make .github/workflows/deploy.yml in your repo.

This workflow will:

checkout

install Node (only if needed)

npm ci

npm run build (produces dist/)

replace /var/www/my-site/* with new dist/

(optional) reload nginx

8.1 Add this workflow file

Create:

mkdir -p .github/workflows
nano .github/workflows/deploy.yml


Paste:

name: Deploy to Home VM

on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: self-hosted

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy dist/ to Nginx web root
        run: |
          sudo rm -rf /var/www/my-site/*
          sudo cp -r dist/* /var/www/my-site/
          sudo chown -R root:www-data /var/www/my-site
          sudo chmod -R 775 /var/www/my-site

      - name: Reload Nginx
        run: sudo systemctl reload nginx


✅ Sources for each key part:

runs-on: self-hosted usage: GitHub self-hosted runners concept docs. 
GitHub Docs
+1

Runner must be running to accept jobs + outbound HTTPS requirement: 
GitHub Docs

svc.sh install/start is the supported “keep it running” approach: 
GitHub Docs
+1

Node setup action (actions/setup-node) is the standard GitHub-maintained method for installing Node in Actions: (GitHub marketplace / official action docs)

Note: The workflow uses sudo for deploy and reload. We’ll tighten this next.

Step 9 — Make sudo safe (so Actions can deploy without giving full root)

Right now, the workflow requires sudo. You have two clean options:

Option 1 (simple): Allow only a few sudo commands without password

We create a sudoers rule for github-runner to run only:

/bin/rm on /var/www/my-site/*

/bin/cp into /var/www/my-site/

/bin/chown and /bin/chmod on that folder

/bin/systemctl reload nginx

This is best practice: least privilege.

GitHub warns that self-hosted runners execute code from your repo; you should limit permissions. 
GitHub Docs
+1

If you want, I’ll give you the exact /etc/sudoers.d/github-runner file next.

What to do right now (in order)

Regenerate a fresh runner token in GitHub (since it was exposed).

Run Steps 7A → 7D and confirm runner shows “Idle”.

Add the workflow in Step 8 and push to main.

Watch the Actions tab — the job should execute on your VM and the site should update.

If you tell me:

do you want to allow sudo for the runner user (least-privilege rule), or

do you want to avoid sudo entirely by making /var/www/my-site writable by the runner user?

…I’ll give you the exact secure configuration for Step 9.

For 7D.1 it asks me for a password for github-runner to use sudo. What is the password? 

There isn’t a password you can “look up” — github-runner is just a Linux user, and sudo asks for that user’s password if you run sudo while logged in as that user.

In the instructions I gave, you created github-runner with:

sudo adduser --disabled-password --gecos "" github-runner


That explicitly creates the account without a password, and also that user is not in the sudo group, so it can’t use sudo at all.

So:

If you are currently logged in as github-runner and you run sudo ..., it will prompt for a password that doesn’t exist, and it will fail (even if you set one) unless the user is allowed to sudo.

✅ That’s expected and correct.

What you should do instead (the right way)
Option A (recommended): Run the svc.sh commands as your admin user (the one that can sudo)

You shouldn’t be using sudo as github-runner anyway.

Do this:

Exit the github-runner shell:

exit


Now as your normal admin user (portfolio), run:

cd /home/github-runner/actions-runner
sudo ./svc.sh install github-runner
sudo ./svc.sh start
sudo ./svc.sh status


This works because:

portfolio has sudo rights (you used it to install packages etc.)

sudo is asking for portfolio’s password, not github-runner’s.

✅ Source: GitHub’s documented way is to use svc.sh to install the runner service, which requires sudo because it installs a system service.

Option B (not recommended): Give github-runner sudo access

You can, but you generally shouldn’t — because the runner executes code from your repo. GitHub explicitly warns about the security implications of self-hosted runners, so giving them broad sudo is risky.

If you ever need elevated access for deployment later, we’ll do least-privilege sudo rules for specific commands only (like reload nginx and copy files), not full sudo.

Quick sanity check (so you know you’re in the right place)

If you run:

whoami


If it says github-runner, don’t run sudo.

If it says portfolio, you’re good to do the sudo ./svc.sh ... commands.

If you want, paste the output of:

whoami
ls -la /home/github-runner/actions-runner


and I’ll tell you exactly what to run next based on where you are in the process.

when i do the cd line from portfolio it says permission denied 

That’s normal on Ubuntu: a user’s home directory is usually private (/home/github-runner often has permissions like drwx------), so your portfolio user can’t cd into it.

There are two clean fixes. I’ll give you both — Option A is the safest and doesn’t weaken permissions.

Option A (recommended): Run the svc.sh commands using sudo without needing to cd

You don’t need to cd into the directory as portfolio. Just execute the script via sudo with the full path:

sudo /home/github-runner/actions-runner/svc.sh install github-runner
sudo /home/github-runner/actions-runner/svc.sh start
sudo /home/github-runner/actions-runner/svc.sh status


This works because:

sudo runs the script as root

root can access /home/github-runner/actions-runner even if it’s private

✅ Source: GitHub’s runner service management on Linux uses svc.sh install/start/status, and these operations require elevated privileges because they create/manage a system service.

Option B: Temporarily become root, then cd

If you prefer to cd and see files:

sudo -i
cd /home/github-runner/actions-runner
./svc.sh install github-runner
./svc.sh start
./svc.sh status
exit


Again, the key idea is: you need root privileges to access the runner directory and install the service.

✅ Source: same GitHub runner service documentation (service install is a privileged operation).

Why you got “permission denied”

Your portfolio user lacks execute permission on /home/github-runner (or it’s set to 700), which blocks traversal even if the runner folder itself is readable.

That’s good security — you shouldn’t change it just to make this work.

After you run Option A or B, verify it in GitHub

Go to:
Repo → Settings → Actions → Runners

Your runner should show as Idle.

If it shows Offline, run:

sudo systemctl status actions.runner.* --no-pager


(Your runner service name is usually actions.runner.<owner>-<repo>.<runnername>.service.)

If you paste the output of:

sudo /home/github-runner/actions-runner/svc.sh status


…I’ll confirm you’re fully installed and ready to create the deployment workflow.

I see the runner on github but this is what shows up on the VM CLI: 


root@portfolio:~# /home/github-runner/actions-runner/svc.sh status
Failed: Must run from runner root or install is corrupt

That message is coming from svc.sh itself and it means exactly what it says:

✅ svc.sh must be executed from inside the runner directory (the “runner root”), because it relies on relative paths and files in that directory. If you run it by absolute path from somewhere else, it errors out.

So the fix is simple: become root, cd into the runner folder, then run ./svc.sh ....

GitHub’s runner docs also show svc.sh being run from the runner directory, not from elsewhere.

Fix: Install/start/status the runner service correctly
1) Become root (interactive root shell)
sudo -i

2) Go to the runner root directory
cd /home/github-runner/actions-runner


Verify you’re in the right place:

ls -la


You should see files like svc.sh, config.sh, run.sh, bin/, etc.

3) Install the service
./svc.sh install github-runner

4) Start the service
./svc.sh start

5) Check service status
./svc.sh status


Then exit root:

exit


✅ Source: GitHub’s official guidance for running self-hosted runner as a service uses svc.sh install/start/status from the runner directory and requires elevated permissions.

Confirm it’s actually running (systemd check)

Run as your normal user:

systemctl list-units --type=service | grep actions.runner


And check the specific service:

sudo systemctl status actions.runner.* --no-pager


✅ Source: The GitHub runner service install creates a systemd service; systemd is used to manage it on Linux.

If ./svc.sh install says it’s already installed

That’s fine — just run:

./svc.sh stop
./svc.sh start
./svc.sh status

=========


What’s next (Step 8): create the deployment workflow

Now we’ll add a GitHub Actions workflow that:

runs on your self-hosted runner

checks out your repo

installs dependencies

builds Vite (dist/)

deploys to /var/www/my-site

reloads Nginx

Because it runs on the VM itself, we don’t need SSH or rsync.

Step 8.1 — Make sure the runner user can write to /var/www/my-site (no sudo needed)

Right now you might need sudo to copy into /var/www/my-site. Let’s avoid that by giving the runner user group write access via www-data, which you already partially did.

Run (as your admin user):

sudo usermod -aG www-data github-runner
sudo chown -R root:www-data /var/www/my-site
sudo chmod -R 775 /var/www/my-site


Then restart the runner service so the group membership applies (services don’t always pick up new groups until restart):

sudo systemctl restart actions.runner.UpsidedownFalcon-portfolio.portfolio-vm


✅ Sources:

Runner service name and management is systemd-based via GitHub runner install (svc.sh creates this service).

Linux group membership changes often require a new session / service restart to take effect (standard Linux behavior).

Step 8.2 — Create the workflow file in your repo

On your local dev machine (or directly on the VM if you’re editing there), in your repo:

Create: .github/workflows/deploy.yml

name: Build and Deploy (Self-hosted)

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: self-hosted

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy dist/ to Nginx web root
        run: |
          rm -rf /var/www/my-site/*
          cp -r dist/* /var/www/my-site/

      - name: Reload Nginx
        run: sudo systemctl reload nginx

Sources for the workflow pieces

runs-on: self-hosted is how you target your self-hosted runner.

actions/checkout@v4 is the standard official checkout action.

actions/setup-node@v4 is the standard official Node setup action.

npm ci is the recommended CI install command for npm-based projects (repeatable clean installs).

Step 8.3 — (Recommended) Remove sudo from the Nginx reload

Right now, the workflow uses:

sudo systemctl reload nginx


That will fail unless github-runner has sudo permissions.

You have two good options:

Option A (best): allow only Nginx reload via sudo (no password)

Create a sudoers rule:

sudo visudo -f /etc/sudoers.d/github-runner-nginx


Paste:

github-runner ALL=NOPASSWD: /bin/systemctl reload nginx


Save and exit.

Now the runner can reload Nginx but cannot do anything else as root.

✅ Sources:

GitHub warns about self-hosted runner security; least-privilege sudo is best practice.

sudoers.d pattern is standard sudo configuration practice (sudo docs).

Option B (simpler): don’t reload Nginx at all

For static files, you don’t technically need to reload Nginx after copying new files.
So you can just remove that step entirely.

Step 8.4 — Commit and push to main
git add .github/workflows/deploy.yml
git commit -m "Add self-hosted build & deploy workflow"
git push origin main


Then check:

GitHub repo → Actions tab

Your workflow should run on your runner

Then visit: https://new.bhavymetakar.com
 and confirm it changed