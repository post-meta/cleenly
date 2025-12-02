"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin, Bell, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
          {!isEditing ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setName(profile?.name || "");
                  setPhone(profile?.phone || "");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            {isEditing && (
              <Button variant="secondary" size="sm">
                Upload Photo
              </Button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              ) : (
                <p className="text-gray-900">{profile?.name || "Not set"}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              {isEditing ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              ) : (
                <p className="text-gray-900">{profile?.phone || "Not set"}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Email Address</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-5 h-5" />
          <span>Contact support to change your email</span>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
          <Button variant="secondary" size="sm">
            Add Address
          </Button>
        </div>
        <div className="flex items-center gap-3 text-gray-500 py-4">
          <MapPin className="w-5 h-5" />
          <span>No saved addresses</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Payment Methods</h2>
          <Button variant="secondary" size="sm">
            Add Card
          </Button>
        </div>
        <div className="flex items-center gap-3 text-gray-500 py-4">
          <CreditCard className="w-5 h-5" />
          <span>No payment methods saved</span>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
            <div>
              <p className="font-medium text-gray-900">Email notifications</p>
              <p className="text-sm text-gray-500">Receive booking confirmations and updates</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
            <div>
              <p className="font-medium text-gray-900">SMS notifications</p>
              <p className="text-sm text-gray-500">Receive reminders about upcoming cleanings</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            <div>
              <p className="font-medium text-gray-900">Marketing emails</p>
              <p className="text-sm text-gray-500">Receive promotions and special offers</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
