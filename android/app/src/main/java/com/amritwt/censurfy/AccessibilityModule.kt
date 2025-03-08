package com.amritwt.censurfy

import android.content.Context
import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule

class AccessibilityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    init {
        // Set the React context to the service
        ContentBlockerAccessibilityService.setReactContext(reactContext)
    }
    
    override fun getName(): String {
        return "AccessibilityModule"
    }
    
    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }
    
    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        val context = reactApplicationContext
        val enabled = isAccessibilityServiceRunning(context)
        promise.resolve(enabled)
    }
    
    @ReactMethod
    fun setBlockingEnabled(enabled: Boolean) {
        ContentBlockerAccessibilityService.setBlockingEnabled(enabled)
    }
    
    @ReactMethod
    fun setBlockerTimer(minutes: Double) {
        ContentBlockerAccessibilityService.setBlockerTimer(minutes.toLong())
    }
    
    @ReactMethod
    fun setUninstallProtection(enabled: Boolean) {
        ContentBlockerAccessibilityService.setUninstallProtection(enabled)
    }
    
    private fun isAccessibilityServiceRunning(context: Context): Boolean {
        val accessibilityEnabled = Settings.Secure.getInt(
            context.contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED, 0
        ) == 1
        
        if (!accessibilityEnabled) return false
        
        val serviceString = context.packageName + "/" + ContentBlockerAccessibilityService::class.java.canonicalName
        val enabledServicesString = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false
        
        return enabledServicesString.contains(serviceString)
    }
    
    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN built in Event Emitter Calls
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN built in Event Emitter Calls
    }
} 