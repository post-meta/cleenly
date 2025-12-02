"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Camera, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";

const SERVICE_TYPE_OPTIONS = [
  { id: "regular", label: "Regular Cleaning" },
  { id: "deep", label: "Deep Cleaning" },
  { id: "move_out", label: "Move-out Cleaning" },
];

const AREA_OPTIONS = [
  "Seattle", "Bellevue", "Kirkland", "Redmond", "Tacoma", "Everett"
];

export default function CleanerProfilePage() {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Cleaner-specific fields
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("35");
  const [yearsExperience, setYearsExperience] = useState("2");
  const [serviceTypes, setServiceTypes] = useState(["regular"]);
  const [serviceAreas, setServiceAreas] = useState(["Seattle"]);

  const toggleServiceType = (type: string) => {
    setServiceTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleServiceArea = (area: string) => {
    setServiceAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cleaner Profile</h1>
        <p className="text-gray-600 mt-1">
          Update your public profile and preferences
        </p>
      </div>

      {/* Profile Photo & Basic Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Public Profile</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Display Name</label>
              <p className="text-gray-900 font-medium">{profile?.name || "Not set"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Bio</label>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers about yourself..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              ) : (
                <p className="text-sm text-gray-600">
                  {bio || "No bio yet. Add one to help customers get to know you!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Types */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Services Offered</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {SERVICE_TYPE_OPTIONS.map(type => (
            <button
              key={type.id}
              onClick={() => isEditing && toggleServiceType(type.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                serviceTypes.includes(type.id)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              } ${isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Areas */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Service Areas</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {AREA_OPTIONS.map(area => (
            <button
              key={area}
              onClick={() => isEditing && toggleServiceArea(area)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                serviceAreas.includes(area)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              } ${isEditing ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Rates & Experience */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Rates & Experience</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Hourly Rate
            </label>
            {isEditing ? (
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="pl-7"
                />
              </div>
            ) : (
              <p className="text-gray-900 font-medium">${hourlyRate}/hour</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            {isEditing ? (
              <Input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="mt-1"
              />
            ) : (
              <p className="text-gray-900 font-medium">{yearsExperience} years</p>
            )}
          </div>
        </div>
      </div>

      {/* Availability preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="font-semibold text-gray-900">Availability</h2>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <a href="/cleaner-dashboard/schedule">Manage Schedule</a>
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          You&apos;re available Monday - Friday, 8am - 6pm
        </p>
      </div>

      {/* Verification status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Verification Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email verified</span>
            <span className="text-green-600 text-sm font-medium">Verified</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Background check</span>
            <span className="text-yellow-600 text-sm font-medium">Pending</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">ID verification</span>
            <span className="text-gray-400 text-sm font-medium">Not started</span>
          </div>
        </div>
      </div>
    </div>
  );
}
