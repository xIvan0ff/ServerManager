cd ~
if ! command -v node &> /dev/null
then
    curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh && sudo apt install nodejs
fi

rm -rf *
git clone https://github.com/xIvan0ff/ServerManager.git .
bash updater.sh