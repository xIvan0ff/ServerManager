cd ~
if ! command -v node &> /dev/null
then
    curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs
fi

git clone https://github.com/xIvan0ff/ServerManager.git
rm -rf client
mkdir client
mv ServerManager/client/* client/
rm -rf ServerManager
cd client
npm install
screen node main.js