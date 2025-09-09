/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";

// The Firebase Admin SDK to access Firestore.
if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();
const auth = getAuth();

// Notifies the admin when a new ATM suggestion is created.
exports.notifyAdminOnSuggestion = onDocumentCreated(
  "atm_suggestions/{suggestionId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.log("No data associated with the event");
      return;
    }

    const suggestionData = snapshot.data();
    const userName = suggestionData.userName || "Um utilizador";
    const atmName = suggestionData.name || "ATM sem nome";

    try {
      // Get the admin user from Firebase Auth by email
      const adminUser = await auth.getUserByEmail("admin@admin.com");
      const adminId = adminUser.uid;

      if (!adminId) {
        logger.error("Admin user ID not found.");
        return;
      }

      // Create the notification document for the admin
      await db.collection("notifications").add({
        userId: adminId,
        title: "Nova Sugestão de ATM",
        message: `${userName} sugeriu um novo ATM: "${atmName}".`,
        read: false,
        createdAt: new Date(),
        type: "generic",
      });

      logger.log(`Notification created for admin (${adminId}) ` +
      `for new suggestion ${snapshot.id}`);
    } catch (error) {
      logger.error(
        "Error sending notification to admin for suggestion " +
        `${snapshot.id}:`, error
      );
    }
  });
