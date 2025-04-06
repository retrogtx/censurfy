package com.censurfy.modules;

import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.censurfy.services.ScreenMonitorService; // Import your service
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AccessibilityModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AccessibilityModule";
    private final ReactApplicationContext reactContext;

    public AccessibilityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "AccessibilityModule"; // Name used in React Native
    }

    // Method to check if our accessibility service is enabled
    @ReactMethod
    public void isAccessibilityServiceEnabled(Promise promise) {
        try {
            int accessibilityEnabled = 0;
            final String serviceId = reactContext.getPackageName() + "/" + ScreenMonitorService.class.getName();
            Log.d(TAG, "Checking accessibility status for service: " + serviceId);

            try {
                accessibilityEnabled = Settings.Secure.getInt(
                        reactContext.getContentResolver(),
                        Settings.Secure.ACCESSIBILITY_ENABLED);
                 Log.d(TAG, "Accessibility enabled system setting: " + accessibilityEnabled);
            } catch (Settings.SettingNotFoundException e) {
                Log.e(TAG, "Error finding accessibility setting", e);
                promise.resolve(false); // Assume disabled if setting not found
                return;
            }

            TextUtils.SimpleStringSplitter colonSplitter = new TextUtils.SimpleStringSplitter(':');

            if (accessibilityEnabled == 1) {
                String settingValue = Settings.Secure.getString(
                        reactContext.getContentResolver(),
                        Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
                // Log.d(TAG, "Enabled services setting: " + settingValue);

                if (settingValue != null) {
                    colonSplitter.setString(settingValue);
                    while (colonSplitter.hasNext()) {
                        String accessibilityService = colonSplitter.next();
                        // Log.d(TAG, "Checking service: " + accessibilityService);
                        if (accessibilityService.equalsIgnoreCase(serviceId)) {
                            Log.i(TAG, "Accessibility service is enabled.");
                            promise.resolve(true);
                            return;
                        }
                    }
                }
            } else {
                Log.i(TAG, "Accessibility system setting is disabled.");
            }

            Log.i(TAG, "Accessibility service is disabled.");
            promise.resolve(false);
        } catch (Exception e) {
            Log.e(TAG, "Error checking accessibility status", e);
            promise.reject("Error", "Failed to check accessibility status.", e);
        }
    }

    // Method to open the system's Accessibility Settings screen
    @ReactMethod
    public void openAccessibilitySettings() {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // Required when starting Activity from non-Activity context
            if (intent.resolveActivity(reactContext.getPackageManager()) != null) {
                 Log.i(TAG, "Opening Accessibility Settings.");
                 reactContext.startActivity(intent);
            } else {
                 Log.e(TAG, "Could not resolve intent for Accessibility Settings.");
                 // Optionally inform the JS side via event or promise rejection
            }
        } catch (Exception e) {
             Log.e(TAG, "Error opening Accessibility Settings", e);
             // Optionally inform the JS side via event or promise rejection
        }

    }
} 