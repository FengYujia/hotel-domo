FILE=/www/backend/retart_flag
if [ ! -f "$FILE" ]; then
    echo "rebuild compose"
    touch /www/backend/retart_flag
    cp -rf /www/backend/config_backup/* /www/backend/config
    echo $ENGINE_IP
    echo $ENGINE_PORT
    sed -i 's/ENGINE_IP/'"$ENGINE_IP"'/g' /www/backend/config/production.json
    sed -i 's/ENGINE_PORT/'"$ENGINE_PORT"'/g' /www/backend/config/production.json
fi
mkdir /www/backend/_tmp
cd /www/backend && npm start