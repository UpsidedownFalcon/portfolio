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

