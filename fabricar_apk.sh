#!/bin/bash
echo "🚀 Reparando y relanzando el proceso maestro..."

# 1. Configurar app.json con el nombre del paquete (EL FIX)
cat << 'APP' > app.json
{
  "expo": {
    "name": "MiPrimeraApp",
    "slug": "MiPrimeraApp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.phonealchemyai.miprimeraapp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "76cec144-f9e5-42a8-a224-981bb95d56b4"
      }
    }
  }
}
APP

# 2. Asegurar que eas.json esté correcto
cat << 'EAS' > eas.json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
EAS

echo "✅ Configuración de paquete Android añadida."

# 3. Sincronizar cambios finales con GitHub
git add .
git commit -m "Fix: android package name added"
git push origin master

# 4. Lanzar la construcción definitiva
echo "🏗️  Cocinando APK en la nube... (Esto te dará el link final)"
eas build --platform android --profile preview --non-interactive
