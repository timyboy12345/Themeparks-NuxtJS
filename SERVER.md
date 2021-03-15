# Deploying

Follow this guide to know how to deploy to an external server

### Move files and folders from dist to external server
This moves all files from the local `.nuxt` folder to the external `dist
```
scp -r .nuxt/* root@95.179.187.20:/var/www/tpvue.arendz.nl/.nuxt
```

### See server CPU usage
This outputs CPU usage
```
mpstat
```

### See PM2 servers
This outputs all PM2 started processes
```
pm2 list
```

### Full deploy script
```
npm run build
scp -r .nuxt/* root@95.179.187.20:/var/www/tpvue.arendz.nl/.nuxt
ssh root@95.179.187.20 pm2 reload tp-vue
```

### Full update script
Re-reload the server after this command, as this is apparently not done correctly
```
scp -r package* root@95.179.187.20:/var/www/tpvue.arendz.nl/
npm run build
scp -r .nuxt/* root@95.179.187.20:/var/www/tpvue.arendz.nl/.nuxt
scp -r .env root@95.179.187.20:/var/www/tpvue.arendz.nl/.env
ssh root@95.179.187.20 npm install --only=prod --prefix /var/www/tpvue.arendz.nl
ssh root@95.179.187.20 pm2 reload tp-vue
```

### Log in to remote
```
ssh root@95.179.187.20
```
