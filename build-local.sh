#!/usr/bin/env bash
set -euo pipefail

# Local Android APK build script
# Prerequisites: Android Studio (or SDK), JDK 17+, Node.js 20+
# Usage: ./build-local.sh [debug|release]

BUILD_TYPE="${1:-debug}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/react-native-app"
ANDROID_DIR="$APP_DIR/android"
PLUGIN_DIR="$APP_DIR/node_modules/@react-native/gradle-plugin"

# ── Detect Android SDK ────────────────────────────────────────────────────────
if [ -z "${ANDROID_HOME:-}" ] && [ -z "${ANDROID_SDK_ROOT:-}" ]; then
    for candidate in \
        "$HOME/Library/Android/sdk" \
        "$HOME/Android/Sdk" \
        "$HOME/android-sdk" \
        "/opt/android-sdk" \
        "/usr/local/lib/android/sdk"; do
        if [ -d "$candidate/platform-tools" ]; then
            export ANDROID_HOME="$candidate"
            break
        fi
    done
fi
ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"

if [ -z "$ANDROID_HOME" ]; then
    echo "ERROR: Android SDK not found."
    echo "Set ANDROID_HOME or install Android Studio."
    exit 1
fi
echo "Using Android SDK: $ANDROID_HOME"

# ── Check required SDK components ────────────────────────────────────────────
SDKMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"
if [ ! -f "$SDKMANAGER" ]; then
    SDKMANAGER="$ANDROID_HOME/tools/bin/sdkmanager"
fi
if [ -f "$SDKMANAGER" ]; then
    echo "Installing required SDK components..."
    yes | "$SDKMANAGER" \
        "platform-tools" \
        "build-tools;34.0.0" \
        "platforms;android-34" \
        "ndk;26.1.10909125" 2>&1 | tail -5
else
    echo "WARN: sdkmanager not found, assuming SDK components are already installed."
fi

# ── npm install ───────────────────────────────────────────────────────────────
echo ""
echo "=== Installing npm dependencies ==="
(cd "$APP_DIR" && npm install)

# ── Pre-build gradle plugin JAR ───────────────────────────────────────────────
echo ""
echo "=== Pre-building @react-native/gradle-plugin ==="
chmod +x "$PLUGIN_DIR/gradlew"
(cd "$PLUGIN_DIR" && ./gradlew jar --no-daemon 2>&1 | tail -20)

JAR_DIR="$PLUGIN_DIR/build/libs"
if ! ls "$JAR_DIR"/*.jar >/dev/null 2>&1; then
    echo "ERROR: JAR build failed — no JARs in $JAR_DIR"
    exit 1
fi
echo "JARs: $(ls "$JAR_DIR"/*.jar)"

# ── Patch settings.gradle ─────────────────────────────────────────────────────
echo ""
echo "=== Patching settings.gradle ==="
cat > "$ANDROID_DIR/settings.gradle" <<GROOVY
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath fileTree(dir: '${JAR_DIR}', include: ['*.jar'])
    }
}

apply plugin: 'com.facebook.react.settings'

settings.extensions.getByName("reactSettings").autolinkLibrariesFromCommand()

rootProject.name = 'WisenetPlayer'
include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')
GROOVY
echo "Patched settings.gradle:"
cat "$ANDROID_DIR/settings.gradle"

# ── Write local.properties ────────────────────────────────────────────────────
echo "sdk.dir=$ANDROID_HOME" > "$ANDROID_DIR/local.properties"

# ── Build ─────────────────────────────────────────────────────────────────────
chmod +x "$ANDROID_DIR/gradlew"
echo ""
if [ "$BUILD_TYPE" = "release" ]; then
    echo "=== Building Release APK ==="
    (cd "$ANDROID_DIR" && ./gradlew assembleRelease --no-daemon)
    APK="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
else
    echo "=== Building Debug APK ==="
    (cd "$ANDROID_DIR" && ./gradlew assembleDebug --no-daemon)
    APK="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"
fi

# ── Done ──────────────────────────────────────────────────────────────────────
if [ -f "$APK" ]; then
    SIZE=$(du -h "$APK" | cut -f1)
    echo ""
    echo "✓ Build succeeded!"
    echo "  APK: $APK ($SIZE)"
else
    echo "ERROR: APK not found at $APK"
    exit 1
fi
