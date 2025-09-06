'use client';

// ========================================
// IMPORTS SECTION
// ========================================
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Phone, MapPin, Navigation, Play, Shield, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

// ========================================
// MAP COMPONENT IMPORT
// ========================================
// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">Loading map...</div>
});

// ========================================
// MAIN COMPONENT - STATE MANAGEMENT
// ========================================
export default function RideGuardDemo() {
  // App state variables
  const [status, setStatus] = useState("title"); // title | on_trip | check | safe | danger | complete | emergency_contacts
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [destination, setDestination] = useState<{lat: number, lng: number} | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [rideProgress, setRideProgress] = useState(0);
  const [isOffTrack, setIsOffTrack] = useState(false);
  const [isReturningToRoute, setIsReturningToRoute] = useState(false);

  // ========================================
  // INITIAL SETUP - LOCATION SETUP
  // ========================================
  // Simulate getting current location
  useEffect(() => {
    // Default to San Francisco coordinates for demo
    setCurrentLocation({ lat: 37.7749, lng: -122.4194 });
    setDestination({ lat: 37.7849, lng: -122.4094 });
  }, []);

  // ========================================
  // RIDE MOVEMENT LOGIC - NORMAL RIDE
  // ========================================
  // Simulate ride movement
  useEffect(() => {
    if (isMoving && status === "on_trip") {
      const interval = setInterval(() => {
        setRideProgress(prev => {
          const newProgress = prev + 0.02;
          
          // Trigger off-route detection at 60% progress
          if (newProgress >= 0.6 && newProgress < 0.62 && !isOffTrack) {
            setIsOffTrack(true);
            setTimeout(() => setStatus("check"), 1000);
          }
          
          // Continue moving off-track even after 100% if off-track
          if (newProgress >= 1.0 && !isOffTrack) {
            setIsMoving(false);
            setStatus("complete");
          }
          
          // Allow progress to continue beyond 100% when off-track
          return isOffTrack ? newProgress : Math.min(newProgress, 1.0);
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isMoving, status, isOffTrack]);

  // ========================================
  // SAFE RESPONSE LOGIC - RETURN TO ROUTE
  // ========================================
  // Handle returning to route when user says they're safe
  useEffect(() => {
    if (isReturningToRoute && status === "safe") {
      const interval = setInterval(() => {
        setRideProgress(prev => {
          // Start from current off-track position and move back to original route
          const returnProgress = prev + 0.015; // Slightly faster when returning
          
          // When we reach the original route (around 60% progress), complete the ride
          if (returnProgress >= 0.6) {
            setIsMoving(false);
            setIsReturningToRoute(false);
            setIsOffTrack(false);
            setStatus("complete");
            return 0.6; // Reset to normal route completion point
          }
          
          return returnProgress;
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isReturningToRoute, status]);

  // ========================================
  // DANGER RESPONSE LOGIC - CONTINUE OFF-TRACK
  // ========================================
  // Handle danger state movement (continue moving away)
  useEffect(() => {
    if (isMoving && status === "danger") {
      const interval = setInterval(() => {
        setRideProgress(prev => {
          const newProgress = prev + 0.02; // Continue moving away
          return newProgress; // Allow unlimited progress when in danger
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isMoving, status]);

  // ========================================
  // BUTTON HANDLERS - USER ACTIONS
  // ========================================
  const startRide = () => {
    setStatus("on_trip");
    setIsMoving(true);
    setRideProgress(0);
    setIsOffTrack(false);
    setIsReturningToRoute(false);
  };

  const triggerCheck = () => setStatus("check");
  
  const markSafe = () => {
    setStatus("safe");
    setIsReturningToRoute(true);
    setIsMoving(true);
  };
  
  const markDanger = () => {
    setStatus("danger");
    // Continue moving away from destination
    setIsMoving(true);
    // Reset progress to continue off-track movement
    setRideProgress(0.6); // Start from where off-track began
  };
  
  const showEmergencyContacts = () => setStatus("emergency_contacts");
  
  const callEmergencyContact = (contact: string) => {
    alert(`Calling ${contact}...`);
    resetSimulation();
  };
  
  const resetSimulation = () => {
    setStatus("title");
    setRideProgress(0);
    setIsMoving(false);
    setIsOffTrack(false);
    setIsReturningToRoute(false);
  };

  // ========================================
  // MAIN UI RENDER - PHONE CONTAINER
  // ========================================
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Mobile Phone Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-black rounded-[2.5rem] p-2 shadow-2xl"
      >
        {/* Phone Screen */}
        <div className="bg-white rounded-[2rem] overflow-hidden h-[700px] flex flex-col">
          {/* ======================================== */}
          {/* PHONE STATUS BAR */}
          {/* ======================================== */}
          <div className="bg-gray-800 text-white text-xs px-4 py-1 flex justify-between items-center">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-6 h-3 border border-white rounded-sm"></div>
            </div>
          </div>

          {/* ======================================== */}
          {/* APP CONTENT AREA */}
          {/* ======================================== */}
          <div className="flex-1 bg-gray-50 p-4 flex flex-col overflow-y-auto">
            {/* App Header */}
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-gray-800">RideGuard</h1>
              <p className="text-xs text-gray-500">Safety First</p>
            </div>

            {/* ======================================== */}
            {/* MAP SECTION */}
            {/* ======================================== */}
            <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
              <MapComponent 
                currentLocation={currentLocation}
                destination={destination}
                status={status}
                rideProgress={rideProgress}
                isOffTrack={isOffTrack}
                isReturningToRoute={isReturningToRoute}
              />
            </div>

            {/* ======================================== */}
            {/* STATUS CARD - MAIN CONTENT AREA */}
            {/* ======================================== */}
            <div className="flex-1">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardContent className="p-4 flex flex-col items-center gap-4 h-full">
                  <AnimatePresence mode="wait">
                    {/* ======================================== */}
                    {/* TITLE SCREEN STATE */}
                    {/* ======================================== */}
                    {status === "title" && (
                      <motion.div
                        key="title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center gap-6 w-full h-full justify-center"
                      >
                        <div className="text-center">
                          <Shield className="text-green-500 w-16 h-16 mx-auto mb-4" />
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">RideGuard</h2>
                          <p className="text-gray-500 text-sm">
                            Your safety companion for every ride
                          </p>
                        </div>
                        <div className="w-full space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Real-time location tracking</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span>Off-route detection</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-red-500" />
                            <span>Emergency assistance</span>
                          </div>
                        </div>
                        <Button 
                          onClick={startRide} 
                          className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-3"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Simulate Ride
                        </Button>
                      </motion.div>
                    )}

                    {/* ======================================== */}
                    {/* RIDE IN PROGRESS STATE */}
                    {/* ======================================== */}
                    {status === "on_trip" && (
                      <motion.div
                        key="on_trip"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <div className="flex items-center gap-2">
                          <Navigation className="text-green-500 w-6 h-6" />
                          <h2 className="text-lg font-semibold">Ride in Progress</h2>
                        </div>
                        <p className="text-gray-500 text-center text-sm">
                          Tracking your trip… All looks good for now.
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(Math.min(rideProgress * 100, 100))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full ${isOffTrack && !isReturningToRoute ? 'bg-orange-500' : isReturningToRoute ? 'bg-green-500' : 'bg-green-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(rideProgress * 100, 100)}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>

                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Route: {rideProgress > 0.6 ? "Off-course detected" : "Normal"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Safety: {rideProgress > 0.6 ? "Checking..." : "Good"}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================== */}
                    {/* SAFETY CHECK STATE */}
                    {/* ======================================== */}
                    {status === "check" && (
                      <motion.div
                        key="check"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <AlertTriangle className="text-yellow-500 w-12 h-12" />
                        <h2 className="text-lg font-semibold text-center">
                          Are you safe?
                        </h2>
                        <p className="text-gray-500 text-center text-sm">
                          We detected your ride may be off-course. Please confirm.
                        </p>
                        <div className="grid grid-cols-2 gap-3 w-full">
                          <Button 
                            onClick={markSafe} 
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            I'm OK
                          </Button>
                          <Button 
                            onClick={markDanger} 
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Need Help
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* ======================================== */}
                    {/* SAFE RESPONSE STATE */}
                    {/* ======================================== */}
                    {status === "safe" && (
                      <motion.div
                        key="safe"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <CheckCircle className="text-green-500 w-12 h-12" />
                        <h2 className="text-lg font-semibold">All Clear</h2>
                        <p className="text-gray-500 text-center text-sm">
                          Thanks for confirming. Ride continues safely.
                        </p>
                        <Button 
                          onClick={() => setStatus("on_trip")} 
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Back to Ride
                        </Button>
                      </motion.div>
                    )}

                    {/* ======================================== */}
                    {/* RIDE COMPLETE STATE */}
                    {/* ======================================== */}
                    {status === "complete" && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <CheckCircle className="text-green-500 w-12 h-12" />
                        <h2 className="text-lg font-semibold">Ride Complete!</h2>
                        <p className="text-gray-500 text-center text-sm">
                          You've arrived safely at your destination.
                        </p>
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Route: Completed</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Safety: Excellent</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setStatus("title");
                            setRideProgress(0);
                            setIsMoving(false);
                          }} 
                          className="mt-2 bg-green-500 hover:bg-green-600 text-white w-full"
                        >
                          Start New Ride
                        </Button>
                      </motion.div>
                    )}

                    {/* ======================================== */}
                    {/* DANGER/EMERGENCY STATE */}
                    {/* ======================================== */}
                    {status === "danger" && (
                      <motion.div
                        key="danger"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <AlertTriangle className="text-red-500 w-12 h-12" />
                        <h2 className="text-lg font-semibold text-center">
                          Emergency Alert Sent
                        </h2>
                        <p className="text-gray-500 text-center text-sm">
                          We've notified your emergency contacts and our Safety Team.
                        </p>
                        <div className="w-full space-y-3">
                          <Button 
                            onClick={resetSimulation}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Phone className="mr-2 h-4 w-4" /> Call 911
                          </Button>
                          <Button 
                            onClick={showEmergencyContacts}
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Users className="mr-2 h-4 w-4" /> Call Emergency Contacts
                          </Button>
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                          Call 911 will reset the simulation
                        </p>
                      </motion.div>
                    )}

                    {/* ======================================== */}
                    {/* EMERGENCY CONTACTS STATE */}
                    {/* ======================================== */}
                    {status === "emergency_contacts" && (
                      <motion.div
                        key="emergency_contacts"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center gap-4 w-full"
                      >
                        <Users className="text-green-500 w-12 h-12" />
                        <h2 className="text-lg font-semibold text-center">
                          Emergency Contacts
                        </h2>
                        <p className="text-gray-500 text-center text-sm">
                          Choose who to call for help
                        </p>
                        <div className="w-full space-y-3">
                          <Button 
                            onClick={() => callEmergencyContact("Mom")}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                          >
                            <Phone className="mr-2 h-4 w-4" /> Call Mom
                          </Button>
                          <Button 
                            onClick={() => callEmergencyContact("Dad")}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Phone className="mr-2 h-4 w-4" /> Call Dad
                          </Button>
                          <Button 
                            onClick={() => callEmergencyContact("Grandma")}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            <Phone className="mr-2 h-4 w-4" /> Call Grandma
                          </Button>
                        </div>
                        <Button 
                          onClick={() => setStatus("danger")}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Back
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ======================================== */}
          {/* PHONE HOME INDICATOR */}
          {/* ======================================== */}
          <div className="bg-white px-4 py-2">
            <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
