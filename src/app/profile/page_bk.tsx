"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { settingsDB, toolsDB } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";

export default function ProfilePage() {
  const [groqApiKey, setGroqApiKey] = useState("");
  const [tavilyApiKey, setTavilyApiKey] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [message, setMessage] = useState("");
  const [modelName, setModelName] = useState("groq");

  useEffect(() => {
    // Load settings on component mount
    const loadSettings = async () => {
      try {
        const storedPassphrase = await settingsDB.getSetting("passphrase");
        if (storedPassphrase) {
          setPassphrase(storedPassphrase);

          const storedGroqApiKey = await settingsDB.getModel("groq");
          if (storedGroqApiKey) {
            const decryptedGroqKey = decrypt(storedGroqApiKey.apiKey, storedPassphrase);
            setGroqApiKey(decryptedGroqKey);
          }

          const storedTavilyApiKey = await toolsDB.getTool("tavily");
          if (storedTavilyApiKey) {
            const decryptedTavilyKey = decrypt(storedTavilyApiKey.apiKey, storedPassphrase);
            setTavilyApiKey(decryptedTavilyKey);
          }
        }
      } catch (error) {
        console.error("Failed to load or decrypt settings:", error);
        setMessage("Error: Could not load settings. Your passphrase may be incorrect or data corrupted.");
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!passphrase) {
      setMessage("Please enter a passphrase to secure your keys.");
      return;
    }

    try {
      // Encrypt the keys
      const encryptedGroqKey = encrypt(groqApiKey, passphrase);
      const encryptedTavilyKey = encrypt(tavilyApiKey, passphrase);

      // Save all settings to the database
      await settingsDB.saveModel({ modelName: "groq", apiKey: encryptedGroqKey });
      await toolsDB.saveTool({ toolName: "tavily", apiKey: encryptedTavilyKey });
      await settingsDB.saveSetting("passphrase", passphrase); // Storing passphrase for auto-decryption

      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage("An error occurred while saving your settings.");
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your API keys and a secret passphrase to secure them.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="groq-api-key"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Groq API Key
            </label>
            <Input
              id="groq-api-key"
              type="password"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
              placeholder="gsk_..."
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="tavily-api-key"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tavily API Key
            </label>
            <Input
              id="tavily-api-key"
              type="password"
              value={tavilyApiKey}
              onChange={(e) => setTavilyApiKey(e.target.value)}
              placeholder="tvly-..."
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="passphrase"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Secret Passphrase
            </label>
            <Input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter a strong, memorable passphrase"
              className="mt-1"
            />
             <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This will be used to encrypt your keys. You will only need to enter this once.
            </p>
          </div>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
        {message && (
          <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}