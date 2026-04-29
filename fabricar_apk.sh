#!/bin/bash
echo "🚀 Iniciando el proceso maestro de fabricación de APK..."

# 1. Configurar eas.json para generar APK directamente
cat << 'EAS' > eas.json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
EAS

echo "✅ Archivo eas.json configurado para formato APK."

# 2. Inicializar Git y subir a GitHub
git init
git add .
git commit -m "Compilación automática desde Ubuntu Android"
gh repo create MiPrimeraApp --public --source=. --remote=origin --push || echo "⚠️ El repo ya existe, saltando..."

echo "✅ Código sincronizado con GitHub."

# 3. Lanzar la construcción en la nube
echo "🏗️ Mandando a cocinar tu APK a los servidores de Expo..."
eas build --platform android --profile preview --non-interactive
