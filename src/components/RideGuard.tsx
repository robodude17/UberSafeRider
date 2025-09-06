'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Phone, MapPin, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">Loading map...</div>
});

export default function RideGuardDemo() {
  const [status, setStatus] = useState("on_trip"); // on_trip | check | safe | danger
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [destination, setDestination] = useState<{lat: number, lng: number} | null>(null);

  // Simulate getting current location
  useEffect(() => {
    // Default to San Francisco coordinates for demo
    setCurrentLocation({ lat: 37.7749, lng: -122.4194 });
    setDestination({ lat: 37.7849, lng: -122.4094 });
  }, []);

  const triggerCheck = () => setStatus("check");
  const markSafe = () => setStatus("safe");
  const markDanger = () => setStatus("danger");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Mobile Phone Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-black rounded-[2.5rem] p-2 shadow-2xl"
      >
        {/* Phone Screen */}
        <div className="bg-white rounded-[2rem] overflow-hidden h-[600px] flex flex-col">
          {/* Status Bar */}
          <div className="bg-gray-800 text-white text-xs px-4 py-1 flex justify-between items-center">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-6 h-3 border border-white rounded-sm"></div>
            </div>
          </div>

          {/* App Content */}
          <div className="flex-1 bg-gray-50 p-4 flex flex-col">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-gray-800">RideGuard</h1>
              <p className="text-xs text-gray-500">Safety First</p>
            </div>

            {/* Map Section */}
            <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
              <MapComponent 
                currentLocation={currentLocation}
                destination={destination}
                status={status}
              />
            </div>

            {/* Status Card */}
            <div className="flex-1">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardContent className="p-4 flex flex-col items-center gap-4 h-full">
                  <AnimatePresence mode="wait">
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
                        <div className="w-full space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>Route: Normal</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Safety: Good</span>
                          </div>
                        </div>
                        <Button 
                          onClick={triggerCheck} 
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Simulate Off-Route Alert
                        </Button>
                      </motion.div>
                    )}

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
                        <Button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white w-full">
                          <Phone className="mr-2 h-4 w-4" /> Call 911
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="bg-white px-4 py-2">
            <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
