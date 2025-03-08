package com.amritwt.censurfy

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.FrameLayout
import android.widget.TextView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class ContentBlockerAccessibilityService : AccessibilityService() {
    private var isBlockingEnabled = false
    private var blockedWords = listOf(
        "porn", "xxx", "sex", "adult", "nude", "naked", "fuck", "cock", "pussy", 
        "dick", "boob", "ass", "tits", "vagina", "penis", "masturbate"
    )
    private var overlayView: View? = null
    private var windowManager: WindowManager? = null
    private var blockerTimer: Long = 0 // Timer in milliseconds
    private var uninstallProtectionEnabled = false

    companion object {
        private var reactContext: ReactApplicationContext? = null

        fun setReactContext(context: ReactApplicationContext) {
            reactContext = context
        }

        fun setBlockingEnabled(enabled: Boolean) {
            val serviceInstance = runningInstance
            serviceInstance?.isBlockingEnabled = enabled
        }

        fun setBlockerTimer(timeInMinutes: Long) {
            val serviceInstance = runningInstance
            serviceInstance?.blockerTimer = timeInMinutes * 60 * 1000 // Convert to milliseconds
        }

        fun setUninstallProtection(enabled: Boolean) {
            val serviceInstance = runningInstance
            serviceInstance?.uninstallProtectionEnabled = enabled
        }

        private var runningInstance: ContentBlockerAccessibilityService? = null
    }

    override fun onCreate() {
        super.onCreate()
        runningInstance = this
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
    }

    override fun onDestroy() {
        super.onDestroy()
        runningInstance = null
        removeOverlay()
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        // Notify React Native that the service is connected
        sendEventToJS("accessibilityServiceConnected", null)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (!isBlockingEnabled) return

        // Handle uninstall protection
        if (uninstallProtectionEnabled && isUninstallScreen(event)) {
            showBlockerOverlay("Uninstall is blocked by Censurfy")
            return
        }

        // Process text content
        val nodeInfo = event.source ?: return
        processNodeForInappropriateContent(nodeInfo)
        nodeInfo.recycle()
    }

    private fun isUninstallScreen(event: AccessibilityEvent): Boolean {
        // Check if the current screen is the uninstall or app info screen
        val packageName = event.packageName?.toString() ?: ""
        return packageName == "com.android.settings" &&
               (event.className?.toString()?.contains("UninstallAppProgress") == true ||
                event.className?.toString()?.contains("InstalledAppDetails") == true)
    }

    private fun processNodeForInappropriateContent(nodeInfo: AccessibilityNodeInfo) {
        // Check text content
        val text = nodeInfo.text?.toString() ?: ""
        if (text.isNotEmpty() && containsInappropriateContent(text)) {
            showBlockerOverlay("Inappropriate content detected")
            return
        }

        // Check content description
        val contentDesc = nodeInfo.contentDescription?.toString() ?: ""
        if (contentDesc.isNotEmpty() && containsInappropriateContent(contentDesc)) {
            showBlockerOverlay("Inappropriate content detected")
            return
        }

        // Recursively check child nodes
        for (i in 0 until nodeInfo.childCount) {
            val child = nodeInfo.getChild(i) ?: continue
            processNodeForInappropriateContent(child)
            child.recycle()
        }
    }

    private fun containsInappropriateContent(text: String): Boolean {
        val lowerText = text.lowercase()
        return blockedWords.any { lowerText.contains(it) }
    }

    private fun showBlockerOverlay(message: String) {
        Handler(Looper.getMainLooper()).post {
            if (overlayView == null) {
                // Create overlay layout
                val inflater = LayoutInflater.from(this)
                overlayView = inflater.inflate(android.R.layout.simple_list_item_1, null)
                
                // Set full screen layout parameters
                val layoutParams = WindowManager.LayoutParams(
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.MATCH_PARENT,
                    WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                    PixelFormat.TRANSLUCENT
                )
                layoutParams.gravity = Gravity.CENTER
                
                // Customize the overlay
                val container = overlayView as FrameLayout
                container.setBackgroundColor(0xDD000000.toInt()) // Semi-transparent black
                
                val textView = container.findViewById<TextView>(android.R.id.text1)
                textView.text = message
                textView.gravity = Gravity.CENTER
                textView.textSize = 24f
                textView.setTextColor(0xFFFFFFFF.toInt())
                
                // Add to window
                windowManager?.addView(overlayView, layoutParams)
                
                // Remove overlay after a delay if timer is set
                if (blockerTimer > 0) {
                    Handler(Looper.getMainLooper()).postDelayed({
                        removeOverlay()
                    }, blockerTimer)
                }
            }
        }
    }

    private fun removeOverlay() {
        Handler(Looper.getMainLooper()).post {
            if (overlayView != null) {
                windowManager?.removeView(overlayView)
                overlayView = null
            }
        }
    }

    private fun sendEventToJS(eventName: String, params: WritableMap?) {
        reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit(eventName, params ?: Arguments.createMap())
    }

    override fun onInterrupt() {
        // Required but not used
    }
} 