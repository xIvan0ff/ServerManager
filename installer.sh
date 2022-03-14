# To use run this in /root :
# curl -Ls https://raw.githubusercontent.com/xIvan0ff/ServerManager/main/installer.sh | bash -


cd ~
if ! command -v node &> /dev/null
then
    curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs
    rm nodesource_setup.sh
fi

git clone https://github.com/xIvan0ff/ServerManager.git
rm -rf client
mkdir client
mv ServerManager/client/* client/
rm -rf ServerManager
chmod -R 777 * 
cd client
echo "Installing main dependencies..."
npm install
echo "Done."
cd browser
echo "Installing L7 attack dependencies..."
npm install
echo "Done."