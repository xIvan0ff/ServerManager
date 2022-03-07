cd ~
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs
git clone https://github.com/xIvan0ff/ServerManager.git
rm -rf server/*
cd client
npm install
screen node main.js