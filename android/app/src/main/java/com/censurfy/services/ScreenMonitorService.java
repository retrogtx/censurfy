package com.censurfy.services;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ScreenMonitorService extends AccessibilityService {

    private static final String TAG = "ScreenMonitorService";
    // Basic list of NSFW words - expand this significantly for real use
    private static final Set<String> NSFW_WORDS = new HashSet<>(Arrays.asList(
            "badword1", "badword2", "nsfwexample", "anotherbadone" // Replace with actual list
    ));

    private final Handler handler = new Handler(Looper.getMainLooper());

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Log.d(TAG, "Event Type: " + AccessibilityEvent.eventTypeToString(event.getEventType()));

        // We are interested in content changes or window state changes
        int eventType = event.getEventType();
        if (eventType == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED ||
            eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED ||
            eventType == AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED) { // Added TEXT_CHANGED for more responsiveness

            AccessibilityNodeInfo source = event.getSource();
            if (source == null) {
                 // Sometimes source is null, try getting root in active window
                 source = getRootInActiveWindow();
                 if (source == null) {
                    // Log.d(TAG, "Source and RootInActiveWindow are null, cannot process event.");
                    return;
                 }
            }

            // Log.d(TAG, "Processing node: " + source.getClassName());
            List<String> textOnScreen = new ArrayList<>();
            extractTextFromNode(source, textOnScreen);
            // Recycle the node info object
             if (source != event.getSource()) { // Only recycle if we called getRootInActiveWindow
                source.recycle();
             }
             // Do not recycle event.getSource() here, the system manages it.


            // Log.d(TAG, "Text Found: " + textOnScreen.toString());

            if (containsNsfw(textOnScreen)) {
                Log.i(TAG, "NSFW content detected!");
                showToastAndExit();
            }
        }
    }

    private void extractTextFromNode(AccessibilityNodeInfo node, List<String> textList) {
        if (node == null) {
            return;
        }

        CharSequence nodeText = node.getText();
        if (nodeText != null && nodeText.length() > 0) {
            // Log.d(TAG, "Node Text: " + nodeText);
            textList.add(nodeText.toString().toLowerCase()); // Convert to lower case for comparison
        }

        // Recursively check child nodes
        for (int i = 0; i < node.getChildCount(); i++) {
            AccessibilityNodeInfo child = node.getChild(i);
            if(child != null){
                 extractTextFromNode(child, textList);
                 // It's important to recycle child nodes if you are done with them,
                 // but since we pass them recursively, recycling here might cause issues.
                 // Let the system handle recycling based on the source node's lifecycle,
                 // or implement careful reference counting if performance becomes an issue.
                 child.recycle(); // Recycle child node after processing
            }

        }
    }

     private boolean containsNsfw(List<String> texts) {
        for (String text : texts) {
             if (text == null) continue;
             String lowerCaseText = text.toLowerCase(); // Ensure comparison is case-insensitive
             for (String nsfwWord : NSFW_WORDS) {
                // Basic check: contains the word. Might need more sophisticated matching (e.g., word boundaries)
                if (lowerCaseText.contains(nsfwWord)) {
                    Log.d(TAG, "Found NSFW word: '" + nsfwWord + "' in text: '" + text + "'");
                    return true;
                }
            }
        }
        return false;
    }


    private void showToastAndExit() {
        // Ensure Toast runs on the main thread
        handler.post(() -> Toast.makeText(getApplicationContext(), "NSFW content detected, exiting.", Toast.LENGTH_LONG).show());

        // Add a small delay to allow the user to see the toast before exiting
        handler.postDelayed(() -> {
            Log.i(TAG, "Performing GLOBAL_ACTION_HOME");
            performGlobalAction(AccessibilityService.GLOBAL_ACTION_HOME);
             // Alternatives:
             // performGlobalAction(AccessibilityService.GLOBAL_ACTION_BACK); // May need multiple calls
             // System.exit(0); // This usually kills the service process, not the foreground app. Not recommended.
        }, 1500); // 1.5 second delay
    }


    @Override
    public void onInterrupt() {
        Log.w(TAG, "Accessibility Service Interrupted");
        // Handle interruption, maybe stop monitoring or clean up resources
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        Log.i(TAG, "Accessibility Service Connected");

        // Configure the service dynamically if needed (alternative to XML config)
        AccessibilityServiceInfo info = getServiceInfo(); // Use getServiceInfo() to potentially modify existing info
        if (info == null) {
            info = new AccessibilityServiceInfo();
        }
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED |
                          AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED |
                          AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED; // Ensure we capture text changes

        // Which feedback types are required (optional)
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC; // Or FEEDBACK_SPOKEN, FEEDBACK_VISUAL etc.

        // Set the flags: allow retrieving window content
        info.flags = AccessibilityServiceInfo.DEFAULT |
                     AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS |
                     AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS |
                     AccessibilityServiceInfo.FLAG_RETRIEVE_WINDOW_CONTENT;

        info.notificationTimeout = 100; // Milliseconds

        // Set the package names you want to listen to (optional)
        // info.packageNames = new String[]{"com.example.app1", "com.example.app2"}; // Listen only to specific apps
        // if null, listens to all apps

        this.setServiceInfo(info);

        Log.i(TAG, "Service configured programmatically");
        Toast.makeText(getApplicationContext(), "Censurfy Monitoring Active", Toast.LENGTH_SHORT).show();
    }

     @Override
    public void onDestroy() {
        Log.w(TAG, "Accessibility Service Destroyed");
        // Clean up resources like handlers
        handler.removeCallbacksAndMessages(null);
        super.onDestroy();
    }
} 