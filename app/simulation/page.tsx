// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { motion, AnimatePresence } from "framer-motion";
// // // import {
// // //   Play,
// // //   Pause,
// // //   RotateCcw,
// // //   Mic,
// // //   MicOff,
// // //   Phone,
// // //   PhoneOff,
// // //   MessageSquare,
// // //   User,
// // //   Bot,
// // //   Clock,
// // //   TrendingUp,
// // //   Star,
// // //   ChevronRight,
// // //   Settings,
// // //   BookOpen,
// // //   Volume2,
// // //   VolumeX,
// // //   Wifi,
// // //   WifiOff,
// // //   AlertCircle,
// // //   CheckCircle,
// // //   Download,
// // //   FileText,
// // //   X,
// // // } from "lucide-react";
// // // import { Button } from "@/components/ui/button";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Progress } from "@/components/ui/progress";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import {
// // //   AlertDialog,
// // //   AlertDialogAction,
// // //   AlertDialogCancel,
// // //   AlertDialogContent,
// // //   AlertDialogDescription,
// // //   AlertDialogFooter,
// // //   AlertDialogHeader,
// // //   AlertDialogTitle,
// // // } from "@/components/ui/alert-dialog";
// // // import type {
// // //   SimulationScenario,
// // //   SimulationMessage,
// // //   MockCustomer,
// // // } from "@/types";
// // // import { useVoiceAgent } from "@/hooks/useVoiceAgent";

// // // const mockCustomers: MockCustomer[] = [
// // //   {
// // //     name: "James Nguyen",
// // //     vehicle: "2021 Toyota HiLux SR5",
// // //     suburb: "Keysborough",
// // //     scenario: "service_due",
// // //     lastService: "2025-10-20",
// // //     upgradeScore: 5,
// // //   },
// // //   {
// // //     name: "Sarah Thompson",
// // //     vehicle: "2022 Mercedes GLC 300",
// // //     suburb: "Berwick",
// // //     scenario: "upgrade_opportunity",
// // //     lastService: "2025-09-10",
// // //     upgradeScore: 4,
// // //   },
// // //   {
// // //     name: "Michael Patel",
// // //     vehicle: "2020 Isuzu D-Max",
// // //     suburb: "Dandenong",
// // //     scenario: "finance_renewal",
// // //     lastService: "2025-08-22",
// // //     upgradeScore: 4,
// // //   },
// // //   {
// // //     name: "Lisa Moran",
// // //     vehicle: "2021 Toyota RAV4 Hybrid",
// // //     suburb: "Chadstone",
// // //     scenario: "objection_handling",
// // //     lastService: "2025-07-20",
// // //     upgradeScore: 3,
// // //   },
// // //   {
// // //     name: "Emma Chen",
// // //     vehicle: "2022 Mercedes C-Class",
// // //     suburb: "Brighton",
// // //     scenario: "callback_follow_up",
// // //     lastService: "2025-09-15",
// // //     upgradeScore: 5,
// // //   },
// // // ];

// // // const scenarioDescriptions: Record<SimulationScenario, string> = {
// // //   service_due: "Customer vehicle is due for scheduled service",
// // //   upgrade_opportunity: "High-value customer eligible for vehicle upgrade",
// // //   finance_renewal: "Customer finance term ending, renewal opportunity",
// // //   objection_handling: "Practice handling common customer objections",
// // //   callback_follow_up: "Follow up on previous inquiry or callback request",
// // // };

// // // const mockConversation: SimulationMessage[] = [
// // //   {
// // //     id: "1",
// // //     role: "agent",
// // //     content: "Good morning, may I please speak with James Nguyen?",
// // //     timestamp: new Date(Date.now() - 5000),
// // //     sentiment: "neutral",
// // //   },
// // //   {
// // //     id: "2",
// // //     role: "customer",
// // //     content: "Speaking, who's this?",
// // //     timestamp: new Date(Date.now() - 4000),
// // //     sentiment: "neutral",
// // //   },
// // //   {
// // //     id: "3",
// // //     role: "agent",
// // //     content:
// // //       "Hi James, this is Aria calling from Patterson Cheney Toyota Keysborough. How are you today?",
// // //     timestamp: new Date(Date.now() - 3000),
// // //     sentiment: "positive",
// // //   },
// // //   {
// // //     id: "4",
// // //     role: "customer",
// // //     content: "Yeah, good thanks. What's this about?",
// // //     timestamp: new Date(Date.now() - 2000),
// // //     sentiment: "neutral",
// // //   },
// // //   {
// // //     id: "5",
// // //     role: "agent",
// // //     content:
// // //       "I'm reaching out because your 2021 HiLux SR5 is coming up for its next scheduled service in April. I wanted to check in and see if you'd like to book it in at a time that suits you.",
// // //     timestamp: new Date(Date.now() - 1000),
// // //     sentiment: "positive",
// // //   },
// // // ];

// // // export default function SimulationPage() {
// // //   const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(
// // //     mockCustomers[0],
// // //   );
// // //   const [selectedScenario, setSelectedScenario] =
// // //     useState<SimulationScenario>("service_due");
// // //   const [isMuted, setIsMuted] = useState(false);
// // //   const [callDuration, setCallDuration] = useState(0);
// // //   const [messages, setMessages] = useState<SimulationMessage[]>([]);
// // //   const [sentimentScore, setSentimentScore] = useState(75);
// // //   const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

// // //   const voiceAgent = useVoiceAgent({
// // //     serverUrl:
// // //       process.env.NEXT_PUBLIC_VOICE_AGENT_URL ||
// // //       "https://patterson-voice.omnisuiteai.com",
// // //     carContext: selectedCustomer?.vehicle,
// // //   });

// // //   const isRunning = voiceAgent.isConnected && voiceAgent.isRecording;
// // //   const isPaused = !voiceAgent.isRecording && voiceAgent.isConnected;

// // //   const handleStartSimulation = () => {
// // //     voiceAgent.startSession();
// // //     voiceAgent.startRecording();
// // //     setMessages([]);
// // //     setCallDuration(0);
// // //   };

// // //   const handlePauseResume = () => {
// // //     if (voiceAgent.isRecording) {
// // //       voiceAgent.stopRecording();
// // //     } else {
// // //       voiceAgent.startRecording();
// // //     }
// // //   };

// // //   const handleEndSessionClick = () => {
// // //     setShowEndSessionDialog(true);
// // //   };

// // //   const handleConfirmEndSession = (downloadSummary: boolean = false) => {
// // //     voiceAgent.endSession();

// // //     if (downloadSummary && messages.length > 0) {
// // //       downloadSessionSummary();
// // //     }

// // //     setMessages([]);
// // //     setCallDuration(0);
// // //     setSentimentScore(75);
// // //     setShowEndSessionDialog(false);
// // //   };

// // //   const downloadSessionSummary = () => {
// // //     const summary = generateSessionSummary();
// // //     const blob = new Blob([summary], { type: "text/plain" });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement("a");
// // //     a.href = url;
// // //     a.download = `voice-session-summary-${Date.now()}.txt`;
// // //     document.body.appendChild(a);
// // //     a.click();
// // //     document.body.removeChild(a);
// // //     URL.revokeObjectURL(url);
// // //   };

// // //   const generateSessionSummary = () => {
// // //     const customer = selectedCustomer;
// // //     const date = new Date().toLocaleString();

// // //     let summary = `VOICE SESSION SUMMARY\n`;
// // //     summary += `===================\n\n`;
// // //     summary += `Date: ${date}\n`;
// // //     summary += `Duration: ${formatDuration(callDuration)}\n\n`;

// // //     if (customer) {
// // //       summary += `CUSTOMER INFORMATION\n`;
// // //       summary += `--------------------\n`;
// // //       summary += `Name: ${customer.name}\n`;
// // //       summary += `Vehicle: ${customer.vehicle}\n`;
// // //       summary += `Location: ${customer.suburb}\n`;
// // //       summary += `Scenario: ${customer.scenario.replace("_", " ")}\n\n`;
// // //     }

// // //     // summary += `TRANSCRIPT\n`
// // //     // summary += `----------\n\n`

// // //     // messages.forEach((msg, index) => {
// // //     //   const speaker = msg.role === "agent" ? "AI Agent" : "Customer";
// // //     //   const time = formatDuration(
// // //     //     Math.floor((Date.now() - msg.timestamp.getTime()) / 1000),
// // //     //   );
// // //     //   summary += `[${speaker}] (${time}): ${msg.content}\n\n`;
// // //     // });

// // //     if (voiceAgent.callLog) {
// // //       summary += `CALL LOG\n`;
// // //       summary += `---------\n\n`;
// // //       summary += `Intent: ${voiceAgent.callLog.intent_category?.replace("_", " ")}\n`;
// // //       summary += `Outcome: ${voiceAgent.callLog.outcome?.replace("_", " ")}\n`;
// // //       summary += `Sentiment: ${voiceAgent.callLog.sentiment}\n`;
// // //       if (voiceAgent.callLog.ai_summary) {
// // //         summary += `AI Summary: ${voiceAgent.callLog.ai_summary}\n`;
// // //       }
// // //     }

// // //     return summary;
// // //   };

// // //   const formatDuration = (seconds: number) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins}:${secs.toString().padStart(2, "0")}`;
// // //   };

// // //   // Track call duration
// // //   useEffect(() => {
// // //     let interval: NodeJS.Timeout;
// // //     if (isRunning) {
// // //       interval = setInterval(() => {
// // //         setCallDuration((prev) => prev + 1);
// // //       }, 1000);
// // //     }
// // //     return () => clearInterval(interval);
// // //   }, [isRunning]);

// // //   // Update messages with transcripts
// // //   useEffect(() => {
// // //     if (voiceAgent.transcript) {
// // //       setMessages((prev) => {
// // //         const lastMessage = prev[prev.length - 1];
// // //         if (lastMessage?.role === "customer") {
// // //           return [
// // //             ...prev.slice(0, -1),
// // //             { ...lastMessage, content: voiceAgent.transcript },
// // //           ];
// // //         }
// // //         return [
// // //           ...prev,
// // //           {
// // //             id: Date.now().toString(),
// // //             role: "customer" as const,
// // //             content: voiceAgent.transcript,
// // //             timestamp: new Date(),
// // //             sentiment: "neutral" as const,
// // //           },
// // //         ];
// // //       });
// // //     }
// // //   }, [voiceAgent.transcript]);

// // //   useEffect(() => {
// // //     if (voiceAgent.agentTranscript) {
// // //       setMessages((prev) => {
// // //         const lastMessage = prev[prev.length - 1];
// // //         if (lastMessage?.role === "agent") {
// // //           return [
// // //             ...prev.slice(0, -1),
// // //             { ...lastMessage, content: voiceAgent.agentTranscript },
// // //           ];
// // //         }
// // //         return [
// // //           ...prev,
// // //           {
// // //             id: Date.now().toString(),
// // //             role: "agent" as const,
// // //             content: voiceAgent.agentTranscript,
// // //             timestamp: new Date(),
// // //             sentiment: "positive" as const,
// // //           },
// // //         ];
// // //       });
// // //     }
// // //   }, [voiceAgent.agentTranscript]);

// // //   return (
// // //     <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
// // //       {/* Header */}
// // //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //         <div>
// // //           <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
// // //             Voice Agent Simulation
// // //           </h1>
// // //           <p className="text-sm text-muted-foreground mt-0.5">
// // //             Test AI voice agent with real-time audio
// // //           </p>
// // //         </div>
// // //         <div className="flex items-center gap-2 sm:gap-3">
// // //           <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl">
// // //             {voiceAgent.isConnected ? (
// // //               <CheckCircle className="w-4 h-4 text-green-500" />
// // //             ) : (
// // //               <WifiOff className="w-4 h-4 text-red-500" />
// // //             )}
// // //             <span className="text-xs font-medium">
// // //               {voiceAgent.isConnected ? "Connected" : "Disconnected"}
// // //             </span>
// // //           </div>
// // //           <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
// // //             <BookOpen className="w-4 h-4" /> Training Guide
// // //           </Button>
// // //           <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
// // //             <Settings className="w-4 h-4" /> Settings
// // //           </Button>
// // //         </div>
// // //       </div>

// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// // //         {/* Left Panel - Configuration */}
// // //         <div className="space-y-4 order-2 lg:order-1">
// // //           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// // //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// // //               <User className="w-4 h-4" /> Select Customer
// // //             </h3>
// // //             <Select
// // //               value={selectedCustomer?.name}
// // //               onValueChange={(value) => {
// // //                 const customer = mockCustomers.find((c) => c.name === value);
// // //                 setSelectedCustomer(customer || null);
// // //               }}
// // //             >
// // //               <SelectTrigger className="w-full rounded-xl">
// // //                 <SelectValue placeholder="Choose a customer" />
// // //               </SelectTrigger>
// // //               <SelectContent className="rounded-xl min-w-full">
// // //                 {mockCustomers.map((customer) => (
// // //                   <SelectItem key={customer.name} value={customer.name}>
// // //                     <div className="flex flex-col">
// // //                       <span className="font-medium">{customer.name}</span>
// // //                       <span className="text-xs text-muted-foreground">
// // //                         {customer.vehicle}
// // //                       </span>
// // //                     </div>
// // //                   </SelectItem>
// // //                 ))}
// // //               </SelectContent>
// // //             </Select>

// // //             {selectedCustomer && (
// // //               <div className="mt-4 p-4 bg-muted/30 rounded-xl space-y-2">
// // //                 <div className="flex justify-between text-sm min-w-0">
// // //                   <span className="text-muted-foreground">Vehicle</span>
// // //                   <span className="font-medium text-right truncate min-w-0 ml-4">
// // //                     {selectedCustomer.vehicle}
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex justify-between text-sm min-w-0">
// // //                   <span className="text-muted-foreground">Location</span>
// // //                   <span className="font-medium text-right truncate min-w-0 ml-4">
// // //                     {selectedCustomer.suburb}
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex justify-between text-sm min-w-0">
// // //                   <span className="text-muted-foreground">Last Service</span>
// // //                   <span className="font-medium text-right truncate min-w-0 ml-4">
// // //                     {selectedCustomer.lastService}
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex justify-between text-sm items-center">
// // //                   <span className="text-muted-foreground">Upgrade Score</span>
// // //                   <div className="flex items-center gap-1">
// // //                     <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
// // //                     <span className="font-medium">
// // //                       {selectedCustomer.upgradeScore}/5
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>

// // //           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// // //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// // //               <MessageSquare className="w-4 h-4" /> Select Scenario
// // //             </h3>
// // //             <Select
// // //               value={selectedScenario}
// // //               onValueChange={(value) =>
// // //                 setSelectedScenario(value as SimulationScenario)
// // //               }
// // //             >
// // //               <SelectTrigger className="w-full rounded-xl">
// // //                 <SelectValue />
// // //               </SelectTrigger>
// // //               <SelectContent className="rounded-xl min-w-full">
// // //                 {(
// // //                   Object.keys(scenarioDescriptions) as SimulationScenario[]
// // //                 ).map((scenario) => (
// // //                   <SelectItem key={scenario} value={scenario}>
// // //                     {scenario
// // //                       .replace("_", " ")
// // //                       .replace(/\b\w/g, (l) => l.toUpperCase())}
// // //                   </SelectItem>
// // //                 ))}
// // //               </SelectContent>
// // //             </Select>
// // //             <p className="text-xs text-muted-foreground mt-3">
// // //               {scenarioDescriptions[selectedScenario]}
// // //             </p>
// // //           </div>

// // //           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// // //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// // //               <Settings className="w-4 h-4" /> AI Agent Settings
// // //             </h3>
// // //             <div className="space-y-3">
// // //               <div>
// // //                 <label className="text-xs font-medium mb-1 block">
// // //                   Agent Personality
// // //                 </label>
// // //                 <Select defaultValue="professional">
// // //                   <SelectTrigger className="w-full rounded-xl h-9">
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent className="rounded-xl min-w-full">
// // //                     <SelectItem value="professional">Professional</SelectItem>
// // //                     <SelectItem value="friendly">Friendly</SelectItem>
// // //                     <SelectItem value="casual">Casual</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //               <div>
// // //                 <label className="text-xs font-medium mb-1 block">
// // //                   Response Speed
// // //                 </label>
// // //                 <Select defaultValue="normal">
// // //                   <SelectTrigger className="w-full rounded-xl h-9">
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent className="rounded-xl min-w-full">
// // //                     <SelectItem value="fast">Fast</SelectItem>
// // //                     <SelectItem value="normal">Normal</SelectItem>
// // //                     <SelectItem value="slow">Slow</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Center Panel - Conversation */}
// // //         <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
// // //           {/* Call Controls */}
// // //           <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
// // //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
// // //               <div className="flex items-center gap-3">
// // //                 <div
// // //                   className={`w-12 h-12 rounded-full flex items-center justify-center ${isRunning ? "bg-green-500 animate-pulse" : "bg-muted"}`}
// // //                 >
// // //                   <Phone
// // //                     className={`w-6 h-6 ${isRunning ? "text-white" : "text-muted-foreground"}`}
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <p className="font-semibold text-foreground">
// // //                     {isRunning ? "Voice Session Active" : "Ready to Start"}
// // //                   </p>
// // //                   <p className="text-xs text-muted-foreground">
// // //                     {isRunning
// // //                       ? formatDuration(callDuration)
// // //                       : "No active session"}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //               <div className="flex items-center gap-2 flex-wrap">
// // //                 {!isRunning ? (
// // //                   <Button
// // //                     className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 w-full sm:w-auto"
// // //                     onClick={handleStartSimulation}
// // //                     disabled={!selectedCustomer || !voiceAgent.isConnected}
// // //                   >
// // //                     <Play className="w-4 h-4" /> Start Voice Session
// // //                   </Button>
// // //                 ) : (
// // //                   <>
// // //                     <Button
// // //                       variant="outline"
// // //                       className={`rounded-xl gap-2 ${voiceAgent.isRecording ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : ""}`}
// // //                       onClick={handlePauseResume}
// // //                     >
// // //                       {voiceAgent.isRecording ? (
// // //                         <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
// // //                       ) : (
// // //                         <MicOff className="w-4 h-4" />
// // //                       )}
// // //                       {voiceAgent.isRecording ? "Recording" : "Paused"}
// // //                     </Button>
// // //                     <Button
// // //                       variant="outline"
// // //                       className={`rounded-xl gap-2 ${voiceAgent.isPlaying ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900" : ""}`}
// // //                       onClick={() => setIsMuted(!isMuted)}
// // //                     >
// // //                       {isMuted ? (
// // //                         <VolumeX className="w-4 h-4" />
// // //                       ) : (
// // //                         <Volume2 className="w-4 h-4" />
// // //                       )}
// // //                     </Button>
// // //                     <Button
// // //                       variant="outline"
// // //                       className="rounded-xl gap-2"
// // //                       onClick={() => {
// // //                         voiceAgent.endSession();
// // //                         setMessages([]);
// // //                         setCallDuration(0);
// // //                         setSentimentScore(75);
// // //                       }}
// // //                     >
// // //                       <RotateCcw className="w-4 h-4" /> Reset
// // //                     </Button>
// // //                     <Button
// // //                       variant="destructive"
// // //                       className="rounded-xl gap-2"
// // //                       onClick={handleEndSessionClick}
// // //                     >
// // //                       <PhoneOff className="w-4 h-4" /> End Session
// // //                     </Button>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {/* Real-time Metrics */}
// // //             {isRunning && (
// // //               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
// // //                 <div className="text-center">
// // //                   <p className="text-xs text-muted-foreground mb-1">
// // //                     Sentiment
// // //                   </p>
// // //                   <div className="flex items-center justify-center gap-1">
// // //                     <TrendingUp className="w-4 h-4 text-green-500" />
// // //                     <span className="text-lg font-bold text-foreground">
// // //                       {sentimentScore}%
// // //                     </span>
// // //                   </div>
// // //                 </div>
// // //                 <div className="text-center">
// // //                   <p className="text-xs text-muted-foreground mb-1">Messages</p>
// // //                   <span className="text-lg font-bold text-foreground">
// // //                     {messages.length}
// // //                   </span>
// // //                 </div>
// // //                 <div className="text-center">
// // //                   <p className="text-xs text-muted-foreground mb-1">
// // //                     Recording
// // //                   </p>
// // //                   <Badge
// // //                     variant={voiceAgent.isRecording ? "default" : "secondary"}
// // //                     className="rounded-lg"
// // //                   >
// // //                     {voiceAgent.isRecording ? "Active" : "Paused"}
// // //                   </Badge>
// // //                 </div>
// // //                 <div className="text-center">
// // //                   <p className="text-xs text-muted-foreground mb-1">
// // //                     Agent Voice
// // //                   </p>
// // //                   <Badge
// // //                     variant={voiceAgent.isPlaying ? "default" : "secondary"}
// // //                     className="rounded-lg"
// // //                   >
// // //                     {voiceAgent.isPlaying ? "Speaking" : "Idle"}
// // //                   </Badge>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Error Display */}
// // //             {voiceAgent.error && (
// // //               <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2">
// // //                 <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
// // //                 <p className="text-xs text-red-700 dark:text-red-400">
// // //                   {voiceAgent.error}
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Conversation Feed */}
// // //           <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
// // //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// // //               <MessageSquare className="w-4 h-4" /> Live Transcript
// // //             </h3>
// // //             <div className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto">
// // //               <AnimatePresence>
// // //                 {messages.length === 0 ? (
// // //                   <div className="text-center py-12 text-muted-foreground">
// // //                     <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
// // //                     <p className="text-sm">
// // //                       Start a voice session to see the conversation
// // //                     </p>
// // //                   </div>
// // //                 ) : (
// // //                   messages.map((message, index) => (
// // //                     <motion.div
// // //                       key={message.id}
// // //                       initial={{ opacity: 0, y: 10 }}
// // //                       animate={{ opacity: 1, y: 0 }}
// // //                       transition={{ delay: index * 0.05 }}
// // //                       className={`flex gap-3 ${message.role === "agent" ? "justify-start" : "justify-end"}`}
// // //                     >
// // //                       <div
// // //                         className={`flex gap-3 max-w-[80%] ${message.role === "agent" ? "flex-row" : "flex-row-reverse"}`}
// // //                       >
// // //                         <div
// // //                           className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
// // //                             message.role === "agent"
// // //                               ? "bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] text-white"
// // //                               : "bg-muted text-muted-foreground"
// // //                           }`}
// // //                         >
// // //                           {message.role === "agent" ? (
// // //                             <Bot className="w-4 h-4" />
// // //                           ) : (
// // //                             <User className="w-4 h-4" />
// // //                           )}
// // //                         </div>
// // //                         <div
// // //                           className={`space-y-1 ${message.role === "agent" ? "text-left" : "text-right"}`}
// // //                         >
// // //                           <div
// // //                             className={`inline-block px-4 py-2 rounded-2xl text-sm ${
// // //                               message.role === "agent"
// // //                                 ? "bg-muted text-foreground rounded-tl-none"
// // //                                 : "bg-[#0C1E3C] text-white rounded-tr-none"
// // //                             }`}
// // //                           >
// // //                             {message.content || "..."}
// // //                           </div>
// // //                           <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
// // //                             <Clock className="w-3 h-3" />
// // //                             {formatDuration(
// // //                               Math.floor(
// // //                                 (Date.now() - message.timestamp.getTime()) /
// // //                                   1000,
// // //                               ),
// // //                             )}
// // //                             {message.sentiment && (
// // //                               <Badge
// // //                                 variant="outline"
// // //                                 className="text-[10px] h-4 px-1"
// // //                               >
// // //                                 {message.sentiment}
// // //                               </Badge>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </motion.div>
// // //                   ))
// // //                 )}
// // //               </AnimatePresence>
// // //             </div>
// // //           </div>

// // //           {/* Call Log Display */}
// // //           {voiceAgent.callLog && (
// // //             <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
// // //               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// // //                 <TrendingUp className="w-4 h-4" /> Call Log
// // //               </h3>
// // //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                 <div className="p-3 bg-muted/30 rounded-xl">
// // //                   <p className="text-xs text-muted-foreground mb-1">
// // //                     Caller Name
// // //                   </p>
// // //                   <p className="text-sm font-medium">
// // //                     {voiceAgent.callLog.caller_name || "N/A"}
// // //                   </p>
// // //                 </div>
// // //                 <div className="p-3 bg-muted/30 rounded-xl">
// // //                   <p className="text-xs text-muted-foreground mb-1">Intent</p>
// // //                   <p className="text-sm font-medium capitalize">
// // //                     {voiceAgent.callLog.intent_category?.replace("_", " ")}
// // //                   </p>
// // //                 </div>
// // //                 <div className="p-3 bg-muted/30 rounded-xl">
// // //                   <p className="text-xs text-muted-foreground mb-1">Outcome</p>
// // //                   <p className="text-sm font-medium capitalize">
// // //                     {voiceAgent.callLog.outcome?.replace("_", " ")}
// // //                   </p>
// // //                 </div>
// // //                 <div className="p-3 bg-muted/30 rounded-xl">
// // //                   <p className="text-xs text-muted-foreground mb-1">
// // //                     Sentiment
// // //                   </p>
// // //                   <Badge
// // //                     variant={
// // //                       voiceAgent.callLog.sentiment === "positive"
// // //                         ? "default"
// // //                         : "secondary"
// // //                     }
// // //                     className="rounded-lg"
// // //                   >
// // //                     {voiceAgent.callLog.sentiment}
// // //                   </Badge>
// // //                 </div>
// // //               </div>
// // //               {voiceAgent.callLog.ai_summary && (
// // //                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
// // //                   <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
// // //                     � Summary: {voiceAgent.callLog.ai_summary}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {/* Recording Download */}
// // //           {voiceAgent.recordingUrl && (
// // //             <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// // //               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// // //                 <Bot className="w-4 h-4" /> Recording
// // //               </h3>
// // //               <a
// // //                 href={voiceAgent.recordingUrl}
// // //                 download
// // //                 className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm"
// // //               >
// // //                 <Download className="w-4 h-4" /> Download Recording
// // //               </a>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* End Session Dialog */}
// // //       <AlertDialog
// // //         open={showEndSessionDialog}
// // //         onOpenChange={setShowEndSessionDialog}
// // //       >
// // //         <AlertDialogContent className="rounded-2xl">
// // //           <AlertDialogHeader>
// // //             <AlertDialogTitle className="flex items-center gap-2">
// // //               <FileText className="w-5 h-5" />
// // //               End Voice Session
// // //             </AlertDialogTitle>
// // //             <AlertDialogDescription>
// // //               Would you like to download a summary of this session before
// // //               ending?
// // //             </AlertDialogDescription>
// // //           </AlertDialogHeader>

// // //           {messages.length > 0 && (
// // //             <div className="py-4">
// // //               <div className="bg-muted/30 rounded-xl p-4 space-y-2">
// // //                 <div className="flex justify-between text-sm">
// // //                   <span className="text-muted-foreground">Duration</span>
// // //                   <span className="font-medium">
// // //                     {formatDuration(callDuration)}
// // //                   </span>
// // //                 </div>
// // //                 <div className="flex justify-between text-sm">
// // //                   <span className="text-muted-foreground">Messages</span>
// // //                   <span className="font-medium">{messages.length}</span>
// // //                 </div>
// // //                 {selectedCustomer && (
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-muted-foreground">Customer</span>
// // //                     <span className="font-medium">{selectedCustomer.name}</span>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}

// // //           <AlertDialogFooter className="gap-2">
// // //             <AlertDialogCancel
// // //               onClick={() => handleConfirmEndSession(false)}
// // //               className="rounded-xl"
// // //             >
// // //               End Without Summary
// // //             </AlertDialogCancel>
// // //             <AlertDialogAction
// // //               onClick={() => handleConfirmEndSession(true)}
// // //               className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2"
// // //             >
// // //               <Download className="w-4 h-4" /> Download & End
// // //             </AlertDialogAction>
// // //           </AlertDialogFooter>
// // //         </AlertDialogContent>
// // //       </AlertDialog>
// // //     </div>
// // //   );
// // // }
// // "use client";

// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //   Play,
// //   Pause,
// //   RotateCcw,
// //   Mic,
// //   MicOff,
// //   Phone,
// //   PhoneOff,
// //   MessageSquare,
// //   User,
// //   Bot,
// //   Clock,
// //   TrendingUp,
// //   Star,
// //   ChevronRight,
// //   Settings,
// //   BookOpen,
// //   Volume2,
// //   VolumeX,
// //   Wifi,
// //   WifiOff,
// //   AlertCircle,
// //   CheckCircle,
// //   Download,
// //   FileText,
// //   X,
// //   Upload,
// //   Table as TableIcon,
// //   CalendarCheck,
// //   CalendarClock,
// //   CheckCircle2,
// //   XCircle,
// //   Trash2,
// //   PlusCircle,
// //   Loader2,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Progress } from "@/components/ui/progress";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import type {
// //   SimulationScenario,
// //   SimulationMessage,
// //   MockCustomer,
// // } from "@/types";
// // import { useVoiceAgent } from "@/hooks/useVoiceAgent";

// // const mockCustomers: MockCustomer[] = [
// //   {
// //     name: "James Nguyen",
// //     vehicle: "2021 Toyota HiLux SR5",
// //     suburb: "Keysborough",
// //     scenario: "service_due",
// //     lastService: "2025-10-20",
// //     upgradeScore: 5,
// //   },
// //   {
// //     name: "Sarah Thompson",
// //     vehicle: "2022 Mercedes GLC 300",
// //     suburb: "Berwick",
// //     scenario: "upgrade_opportunity",
// //     lastService: "2025-09-10",
// //     upgradeScore: 4,
// //   },
// //   {
// //     name: "Michael Patel",
// //     vehicle: "2020 Isuzu D-Max",
// //     suburb: "Dandenong",
// //     scenario: "finance_renewal",
// //     lastService: "2025-08-22",
// //     upgradeScore: 4,
// //   },
// //   {
// //     name: "Lisa Moran",
// //     vehicle: "2021 Toyota RAV4 Hybrid",
// //     suburb: "Chadstone",
// //     scenario: "objection_handling",
// //     lastService: "2025-07-20",
// //     upgradeScore: 3,
// //   },
// //   {
// //     name: "Emma Chen",
// //     vehicle: "2022 Mercedes C-Class",
// //     suburb: "Brighton",
// //     scenario: "callback_follow_up",
// //     lastService: "2025-09-15",
// //     upgradeScore: 5,
// //   },
// // ];

// // const scenarioDescriptions: Record<SimulationScenario, string> = {
// //   service_due: "Customer vehicle is due for scheduled service",
// //   upgrade_opportunity: "High-value customer eligible for vehicle upgrade",
// //   finance_renewal: "Customer finance term ending, renewal opportunity",
// //   objection_handling: "Practice handling common customer objections",
// //   callback_follow_up: "Follow up on previous inquiry or callback request",
// // };

// // const mockConversation: SimulationMessage[] = [
// //   {
// //     id: "1",
// //     role: "agent",
// //     content: "Good morning, may I please speak with James Nguyen?",
// //     timestamp: new Date(Date.now() - 5000),
// //     sentiment: "neutral",
// //   },
// //   {
// //     id: "2",
// //     role: "customer",
// //     content: "Speaking, who's this?",
// //     timestamp: new Date(Date.now() - 4000),
// //     sentiment: "neutral",
// //   },
// //   {
// //     id: "3",
// //     role: "agent",
// //     content:
// //       "Hi James, this is Aria calling from Patterson Cheney Toyota Keysborough. How are you today?",
// //     timestamp: new Date(Date.now() - 3000),
// //     sentiment: "positive",
// //   },
// //   {
// //     id: "4",
// //     role: "customer",
// //     content: "Yeah, good thanks. What's this about?",
// //     timestamp: new Date(Date.now() - 2000),
// //     sentiment: "neutral",
// //   },
// //   {
// //     id: "5",
// //     role: "agent",
// //     content:
// //       "I'm reaching out because your 2021 HiLux SR5 is coming up for its next scheduled service in April. I wanted to check in and see if you'd like to book it in at a time that suits you.",
// //     timestamp: new Date(Date.now() - 1000),
// //     sentiment: "positive",
// //   },
// // ];

// // // ─── SimulationCsvAndBookings ──────────────────────────────────────────────
// // // CSV test-sheet import/export + live mock booking calendar. Merged inline
// // // here (rather than a separate file) so this is a single complete page.
// // // Fulfils: "upload test sheet" (as CSV, not Google Sheet, per instruction)
// // // and "mock booking calendar & confirmation UI that writes fake booking ref
// // // back."
// // function SimulationCsvAndBookings({
// //   serverUrl,
// //   onSelectCustomer,
// // }: {
// //   serverUrl: string;
// //   onSelectCustomer: (
// //     customer: MockCustomer & { id?: string; phone?: string; brand?: string },
// //   ) => void;
// // }) {
// //   const [importResult, setImportResult] = useState<any>(null);
// //   const [importing, setImporting] = useState(false);
// //   const [customers, setCustomers] = useState<any[]>([]);
// //   const [bookings, setBookings] = useState<any[]>([]);
// //   const [loadingBookings, setLoadingBookings] = useState(false);
// //   const [showBookingForm, setShowBookingForm] = useState(false);
// //   const [bookingDraft, setBookingDraft] = useState({
// //     customer_name: "",
// //     phone: "",
// //     vehicle: "",
// //     brand: "Toyota",
// //     type: "service",
// //     date: "",
// //     time: "",
// //   });
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const fetchCustomers = useCallback(async () => {
// //     try {
// //       const res = await fetch(`${serverUrl}/api/simulation/customers`);
// //       if (res.ok) setCustomers(await res.json());
// //     } catch {
// //       /* server may be offline in design preview — fail quietly */
// //     }
// //   }, [serverUrl]);

// //   const fetchBookings = useCallback(async () => {
// //     setLoadingBookings(true);
// //     try {
// //       const res = await fetch(`${serverUrl}/api/mock-bookings`);
// //       if (res.ok) setBookings(await res.json());
// //     } catch {
// //       /* ignore */
// //     } finally {
// //       setLoadingBookings(false);
// //     }
// //   }, [serverUrl]);

// //   useEffect(() => {
// //     fetchCustomers();
// //     fetchBookings();
// //   }, [fetchCustomers, fetchBookings]);

// //   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     setImporting(true);
// //     setImportResult(null);
// //     try {
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       const res = await fetch(
// //         `${serverUrl}/api/simulation/customers/import-csv`,
// //         {
// //           method: "POST",
// //           body: formData,
// //         },
// //       );
// //       const data = await res.json();
// //       setImportResult({ ok: res.ok, ...data });
// //       if (res.ok) fetchCustomers();
// //     } catch (err) {
// //       setImportResult({
// //         ok: false,
// //         error: "Upload failed — check the server is reachable",
// //       });
// //     } finally {
// //       setImporting(false);
// //       if (fileInputRef.current) fileInputRef.current.value = "";
// //     }
// //   };

// //   const handleDeleteCustomer = async (id: string) => {
// //     await fetch(`${serverUrl}/api/simulation/customers/${id}`, {
// //       method: "DELETE",
// //     });
// //     fetchCustomers();
// //   };

// //   const handleCreateBooking = async () => {
// //     if (!bookingDraft.customer_name || !bookingDraft.date || !bookingDraft.time)
// //       return;
// //     await fetch(`${serverUrl}/api/mock-bookings`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(bookingDraft),
// //     });
// //     setBookingDraft({
// //       customer_name: "",
// //       phone: "",
// //       vehicle: "",
// //       brand: "Toyota",
// //       type: "service",
// //       date: "",
// //       time: "",
// //     });
// //     setShowBookingForm(false);
// //     fetchBookings();
// //   };

// //   const handleCancelBooking = async (id: string) => {
// //     await fetch(`${serverUrl}/api/mock-bookings/${id}/cancel`, {
// //       method: "POST",
// //     });
// //     fetchBookings();
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {/* CSV Test-Sheet Import/Export */}
// //       <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //         <div className="flex items-center justify-between mb-4">
// //           <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
// //             <TableIcon className="w-4 h-4" /> Test Sheet (CSV)
// //           </h3>
// //           <Badge variant="outline" className="text-[10px]">
// //             {customers.length} loaded
// //           </Badge>
// //         </div>

// //         <p className="text-xs text-muted-foreground mb-3">
// //           Upload a CSV of test customers to drive the simulation — columns:{" "}
// //           <code className="text-[11px] bg-muted px-1 py-0.5 rounded">
// //             name, phone, vehicle, brand, suburb, scenario, lastService,
// //             upgradeScore
// //           </code>
// //         </p>

// //         <div className="flex flex-wrap gap-2 mb-3">
// //           <input
// //             ref={fileInputRef}
// //             type="file"
// //             accept=".csv"
// //             onChange={handleFileChange}
// //             className="hidden"
// //             id="csv-upload-input"
// //           />
// //           <Button
// //             size="sm"
// //             className="rounded-xl gap-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white"
// //             onClick={() => fileInputRef.current?.click()}
// //             disabled={importing}
// //           >
// //             {importing ? (
// //               <Loader2 className="w-4 h-4 animate-spin" />
// //             ) : (
// //               <Upload className="w-4 h-4" />
// //             )}
// //             Import CSV
// //           </Button>
// //           <Button
// //             size="sm"
// //             variant="outline"
// //             className="rounded-xl gap-2"
// //             onClick={() =>
// //               window.open(
// //                 `${serverUrl}/api/simulation/customers/template-csv`,
// //                 "_blank",
// //               )
// //             }
// //           >
// //             <Download className="w-4 h-4" /> Download Template
// //           </Button>
// //           <Button
// //             size="sm"
// //             variant="outline"
// //             className="rounded-xl gap-2"
// //             onClick={() =>
// //               window.open(
// //                 `${serverUrl}/api/simulation/customers/export-csv`,
// //                 "_blank",
// //               )
// //             }
// //             disabled={customers.length === 0}
// //           >
// //             <Download className="w-4 h-4" /> Export Loaded Rows
// //           </Button>
// //         </div>

// //         {importResult && (
// //           <div
// //             className={`p-3 rounded-xl text-xs flex items-start gap-2 mb-3 ${
// //               importResult.ok
// //                 ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
// //                 : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
// //             }`}
// //           >
// //             {importResult.ok ? (
// //               <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
// //             ) : (
// //               <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
// //             )}
// //             <div>
// //               {importResult.ok ? (
// //                 <>
// //                   <p className="font-medium">
// //                     Imported {importResult.imported} row
// //                     {importResult.imported === 1 ? "" : "s"}
// //                     {importResult.skipped
// //                       ? `, skipped ${importResult.skipped}`
// //                       : ""}
// //                     .
// //                   </p>
// //                   {importResult.errors?.length > 0 && (
// //                     <ul className="mt-1 list-disc list-inside text-muted-foreground">
// //                       {importResult.errors
// //                         .slice(0, 5)
// //                         .map((e: string, i: number) => (
// //                           <li key={i}>{e}</li>
// //                         ))}
// //                     </ul>
// //                   )}
// //                 </>
// //               ) : (
// //                 <p className="font-medium">
// //                   {importResult.error || "Import failed"}
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {customers.length > 0 && (
// //           <div className="max-h-[220px] overflow-y-auto space-y-1.5">
// //             {customers.map((c) => (
// //               <div
// //                 key={c.id}
// //                 className="flex items-center justify-between gap-2 p-2.5 bg-muted/30 rounded-xl text-sm"
// //               >
// //                 <button
// //                   className="text-left min-w-0 flex-1"
// //                   onClick={() => onSelectCustomer(c)}
// //                   title="Load into simulation"
// //                 >
// //                   <p className="font-medium truncate">{c.name}</p>
// //                   <p className="text-xs text-muted-foreground truncate">
// //                     {c.vehicle} · {c.scenario?.replace(/_/g, " ")}
// //                   </p>
// //                 </button>
// //                 <Button
// //                   size="icon"
// //                   variant="ghost"
// //                   className="h-7 w-7 rounded-lg shrink-0"
// //                   onClick={() => handleDeleteCustomer(c.id)}
// //                 >
// //                   <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
// //                 </Button>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Mock Booking Calendar */}
// //       <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //         <div className="flex items-center justify-between mb-4">
// //           <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
// //             <CalendarCheck className="w-4 h-4" /> Mock Booking Calendar
// //           </h3>
// //           <Button
// //             size="sm"
// //             variant="outline"
// //             className="rounded-xl gap-1.5 h-7 text-xs"
// //             onClick={() => setShowBookingForm((s) => !s)}
// //           >
// //             <PlusCircle className="w-3.5 h-3.5" /> New
// //           </Button>
// //         </div>

// //         {showBookingForm && (
// //           <div className="mb-4 p-3 bg-muted/30 rounded-xl space-y-2">
// //             <input
// //               className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
// //               placeholder="Customer name"
// //               value={bookingDraft.customer_name}
// //               onChange={(e) =>
// //                 setBookingDraft((d) => ({
// //                   ...d,
// //                   customer_name: e.target.value,
// //                 }))
// //               }
// //             />
// //             <input
// //               className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
// //               placeholder="Vehicle"
// //               value={bookingDraft.vehicle}
// //               onChange={(e) =>
// //                 setBookingDraft((d) => ({ ...d, vehicle: e.target.value }))
// //               }
// //             />
// //             <div className="grid grid-cols-2 gap-2">
// //               <Select
// //                 value={bookingDraft.type}
// //                 onValueChange={(v) =>
// //                   setBookingDraft((d) => ({ ...d, type: v }))
// //                 }
// //               >
// //                 <SelectTrigger className="h-8 rounded-lg text-xs">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent className="rounded-xl">
// //                   <SelectItem value="service">Service</SelectItem>
// //                   <SelectItem value="test_drive">Test Drive</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //               <Select
// //                 value={bookingDraft.brand}
// //                 onValueChange={(v) =>
// //                   setBookingDraft((d) => ({ ...d, brand: v }))
// //                 }
// //               >
// //                 <SelectTrigger className="h-8 rounded-lg text-xs">
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent className="rounded-xl">
// //                   <SelectItem value="Toyota">Toyota</SelectItem>
// //                   <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
// //                   <SelectItem value="Isuzu">Isuzu</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="grid grid-cols-2 gap-2">
// //               <input
// //                 type="date"
// //                 className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
// //                 value={bookingDraft.date}
// //                 onChange={(e) =>
// //                   setBookingDraft((d) => ({ ...d, date: e.target.value }))
// //                 }
// //               />
// //               <input
// //                 type="time"
// //                 className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
// //                 value={bookingDraft.time}
// //                 onChange={(e) =>
// //                   setBookingDraft((d) => ({ ...d, time: e.target.value }))
// //                 }
// //               />
// //             </div>
// //             <Button
// //               size="sm"
// //               className="w-full rounded-lg bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white text-xs"
// //               onClick={handleCreateBooking}
// //             >
// //               Confirm Booking
// //             </Button>
// //           </div>
// //         )}

// //         {loadingBookings ? (
// //           <div className="py-8 flex justify-center">
// //             <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
// //           </div>
// //         ) : bookings.length === 0 ? (
// //           <div className="text-center py-8 text-muted-foreground">
// //             <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-50" />
// //             <p className="text-sm">No bookings written back yet</p>
// //           </div>
// //         ) : (
// //           <div className="max-h-[280px] overflow-y-auto space-y-1.5">
// //             {bookings.map((b) => (
// //               <div
// //                 key={b.id}
// //                 className="p-2.5 bg-muted/30 rounded-xl text-sm flex items-center justify-between gap-2"
// //               >
// //                 <div className="min-w-0">
// //                   <div className="flex items-center gap-2">
// //                     <p className="font-medium truncate">{b.customer_name}</p>
// //                     <Badge variant="outline" className="text-[10px] shrink-0">
// //                       {b.booking_ref}
// //                     </Badge>
// //                   </div>
// //                   <p className="text-xs text-muted-foreground truncate">
// //                     {b.vehicle || "—"} · {b.type.replace("_", " ")} · {b.date}{" "}
// //                     {b.time}
// //                   </p>
// //                 </div>
// //                 {b.status === "confirmed" ? (
// //                   <Button
// //                     size="sm"
// //                     variant="outline"
// //                     className="rounded-lg h-7 text-xs shrink-0"
// //                     onClick={() => handleCancelBooking(b.id)}
// //                   >
// //                     Cancel
// //                   </Button>
// //                 ) : (
// //                   <Badge variant="secondary" className="text-[10px] shrink-0">
// //                     Cancelled
// //                   </Badge>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Call Log Export */}
// //       <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //         <h3 className="text-sm font-semibold text-foreground mb-3">
// //           Export Call Logs
// //         </h3>
// //         <Button
// //           size="sm"
// //           variant="outline"
// //           className="rounded-xl gap-2 w-full"
// //           onClick={() =>
// //             window.open(`${serverUrl}/api/call-logs/export-csv`, "_blank")
// //           }
// //         >
// //           <Download className="w-4 h-4" /> Download All Call Logs (CSV)
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function SimulationPage() {
// //   const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(
// //     mockCustomers[0],
// //   );
// //   const [selectedScenario, setSelectedScenario] =
// //     useState<SimulationScenario>("service_due");
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [callDuration, setCallDuration] = useState(0);
// //   const [messages, setMessages] = useState<SimulationMessage[]>([]);
// //   const [sentimentScore, setSentimentScore] = useState(75);
// //   const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);

// //   const serverUrl =
// //     process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "http://localhost:4051"; // Default to localhost if not set

// //   const voiceAgent = useVoiceAgent({
// //     serverUrl,
// //     carContext: selectedCustomer?.vehicle,
// //   });

// //   const isRunning = voiceAgent.isConnected && voiceAgent.isRecording;
// //   const isPaused = !voiceAgent.isRecording && voiceAgent.isConnected;

// //   const handleStartSimulation = () => {
// //     voiceAgent.startSession();
// //     voiceAgent.startRecording();
// //     setMessages([]);
// //     setCallDuration(0);
// //   };

// //   const handlePauseResume = () => {
// //     if (voiceAgent.isRecording) {
// //       voiceAgent.stopRecording();
// //     } else {
// //       voiceAgent.startRecording();
// //     }
// //   };

// //   const handleEndSessionClick = () => {
// //     setShowEndSessionDialog(true);
// //   };

// //   const handleConfirmEndSession = (downloadSummary: boolean = false) => {
// //     voiceAgent.endSession();

// //     if (downloadSummary && messages.length > 0) {
// //       downloadSessionSummary();
// //     }

// //     setMessages([]);
// //     setCallDuration(0);
// //     setSentimentScore(75);
// //     setShowEndSessionDialog(false);
// //   };

// //   // const downloadSessionSummary = () => {
// //   //   const summary = generateSessionSummary();
// //   //   const blob = new Blob([summary], { type: "text/plain" });
// //   //   const url = URL.createObjectURL(blob);
// //   //   const a = document.createElement("a");
// //   //   a.href = url;
// //   //   a.download = `voice-session-summary-${Date.now()}.txt`;
// //   //   document.body.appendChild(a);
// //   //   a.click();
// //   //   document.body.removeChild(a);
// //   //   URL.revokeObjectURL(url);
// //   // };

// //   const downloadSessionSummary = async () => {
// //     try {
// //       const res = await fetch(`${serverUrl}/api/session-summary/pdf`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           customer: selectedCustomer,
// //           duration: callDuration,
// //           callLog: voiceAgent.callLog,
// //         }),
// //       });

// //       if (!res.ok) {
// //         throw new Error(`Server returned ${res.status}`);
// //       }

// //       const blob = await res.blob();
// //       const url = URL.createObjectURL(blob);
// //       const a = document.createElement("a");
// //       a.href = url;
// //       a.download = `voice-session-summary-${Date.now()}.pdf`;
// //       document.body.appendChild(a);
// //       a.click();
// //       document.body.removeChild(a);
// //       URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error("Failed to download session summary PDF:", err);
// //     }
// //   };
// //   const generateSessionSummary = () => {
// //     const customer = selectedCustomer;
// //     const date = new Date().toLocaleString();

// //     let summary = `VOICE SESSION SUMMARY\n`;
// //     summary += `===================\n\n`;
// //     summary += `Date: ${date}\n`;
// //     summary += `Duration: ${formatDuration(callDuration)}\n\n`;

// //     if (customer) {
// //       summary += `CUSTOMER INFORMATION\n`;
// //       summary += `--------------------\n`;
// //       summary += `Name: ${customer.name}\n`;
// //       summary += `Vehicle: ${customer.vehicle}\n`;
// //       summary += `Location: ${customer.suburb}\n`;
// //       summary += `Scenario: ${customer.scenario.replace("_", " ")}\n\n`;
// //     }

// //     // summary += `TRANSCRIPT\n`
// //     // summary += `----------\n\n`

// //     // messages.forEach((msg, index) => {
// //     //   const speaker = msg.role === "agent" ? "AI Agent" : "Customer";
// //     //   const time = formatDuration(
// //     //     Math.floor((Date.now() - msg.timestamp.getTime()) / 1000),
// //     //   );
// //     //   summary += `[${speaker}] (${time}): ${msg.content}\n\n`;
// //     // });

// //     if (voiceAgent.callLog) {
// //       summary += `CALL LOG\n`;
// //       summary += `---------\n\n`;
// //       summary += `Intent: ${voiceAgent.callLog.intent_category?.replace("_", " ")}\n`;
// //       summary += `Outcome: ${voiceAgent.callLog.outcome?.replace("_", " ")}\n`;
// //       summary += `Sentiment: ${voiceAgent.callLog.sentiment}\n`;
// //       if (voiceAgent.callLog.ai_summary) {
// //         summary += `AI Summary: ${voiceAgent.callLog.ai_summary}\n`;
// //       }
// //     }

// //     return summary;
// //   };

// //   const formatDuration = (seconds: number) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, "0")}`;
// //   };

// //   // Load a CSV-imported row into the existing customer selector. CSV rows
// //   // carry extra fields (id, phone, brand) that MockCustomer doesn't
// //   // declare — spread them on anyway so useVoiceAgent / the backend can
// //   // pick them up once its carContext prop is extended to accept a full
// //   // customer object instead of just a vehicle string (see GAP_ANALYSIS.md
// //   // §2.5 — useVoiceAgent.ts needs a small update to send `{ customer }`
// //   // rather than `{ carContext }` for this to fully reach the backend).
// //   const handleSelectImportedCustomer = (
// //     customer: MockCustomer & { id?: string; phone?: string; brand?: string },
// //   ) => {
// //     setSelectedCustomer(customer);
// //     setSelectedScenario(customer.scenario as SimulationScenario);
// //   };

// //   // Track call duration
// //   useEffect(() => {
// //     let interval: NodeJS.Timeout;
// //     if (isRunning) {
// //       interval = setInterval(() => {
// //         setCallDuration((prev) => prev + 1);
// //       }, 1000);
// //     }
// //     return () => clearInterval(interval);
// //   }, [isRunning]);

// //   // Update messages with transcripts
// //   useEffect(() => {
// //     if (voiceAgent.transcript) {
// //       setMessages((prev) => {
// //         const lastMessage = prev[prev.length - 1];
// //         if (lastMessage?.role === "customer") {
// //           return [
// //             ...prev.slice(0, -1),
// //             { ...lastMessage, content: voiceAgent.transcript },
// //           ];
// //         }
// //         return [
// //           ...prev,
// //           {
// //             id: Date.now().toString(),
// //             role: "customer" as const,
// //             content: voiceAgent.transcript,
// //             timestamp: new Date(),
// //             sentiment: "neutral" as const,
// //           },
// //         ];
// //       });
// //     }
// //   }, [voiceAgent.transcript]);

// //   useEffect(() => {
// //     if (voiceAgent.agentTranscript) {
// //       setMessages((prev) => {
// //         const lastMessage = prev[prev.length - 1];
// //         if (lastMessage?.role === "agent") {
// //           return [
// //             ...prev.slice(0, -1),
// //             { ...lastMessage, content: voiceAgent.agentTranscript },
// //           ];
// //         }
// //         return [
// //           ...prev,
// //           {
// //             id: Date.now().toString(),
// //             role: "agent" as const,
// //             content: voiceAgent.agentTranscript,
// //             timestamp: new Date(),
// //             sentiment: "positive" as const,
// //           },
// //         ];
// //       });
// //     }
// //   }, [voiceAgent.agentTranscript]);

// //   return (
// //     <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <div>
// //           <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
// //             Voice Agent Simulation
// //           </h1>
// //           <p className="text-sm text-muted-foreground mt-0.5">
// //             Test AI voice agent with real-time audio
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-2 sm:gap-3">
// //           <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl">
// //             {voiceAgent.isConnected ? (
// //               <CheckCircle className="w-4 h-4 text-green-500" />
// //             ) : (
// //               <WifiOff className="w-4 h-4 text-red-500" />
// //             )}
// //             <span className="text-xs font-medium">
// //               {voiceAgent.isConnected ? "Connected" : "Disconnected"}
// //             </span>
// //           </div>
// //           <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
// //             <BookOpen className="w-4 h-4" /> Training Guide
// //           </Button>
// //           <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
// //             <Settings className="w-4 h-4" /> Settings
// //           </Button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         {/* Left Panel - Configuration */}
// //         <div className="space-y-4 order-2 lg:order-1">
// //           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// //               <User className="w-4 h-4" /> Select Customer
// //             </h3>
// //             <Select
// //               value={selectedCustomer?.name}
// //               onValueChange={(value) => {
// //                 const customer = mockCustomers.find((c) => c.name === value);
// //                 setSelectedCustomer(customer || null);
// //               }}
// //             >
// //               <SelectTrigger className="w-full rounded-xl">
// //                 <SelectValue placeholder="Choose a customer" />
// //               </SelectTrigger>
// //               <SelectContent className="rounded-xl min-w-full">
// //                 {mockCustomers.map((customer) => (
// //                   <SelectItem key={customer.name} value={customer.name}>
// //                     <div className="flex flex-col">
// //                       <span className="font-medium">{customer.name}</span>
// //                       <span className="text-xs text-muted-foreground">
// //                         {customer.vehicle}
// //                       </span>
// //                     </div>
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>

// //             {selectedCustomer && (
// //               <div className="mt-4 p-4 bg-muted/30 rounded-xl space-y-2">
// //                 <div className="flex justify-between text-sm min-w-0">
// //                   <span className="text-muted-foreground">Vehicle</span>
// //                   <span className="font-medium text-right truncate min-w-0 ml-4">
// //                     {selectedCustomer.vehicle}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between text-sm min-w-0">
// //                   <span className="text-muted-foreground">Location</span>
// //                   <span className="font-medium text-right truncate min-w-0 ml-4">
// //                     {selectedCustomer.suburb}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between text-sm min-w-0">
// //                   <span className="text-muted-foreground">Last Service</span>
// //                   <span className="font-medium text-right truncate min-w-0 ml-4">
// //                     {selectedCustomer.lastService}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between text-sm items-center">
// //                   <span className="text-muted-foreground">Upgrade Score</span>
// //                   <div className="flex items-center gap-1">
// //                     <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
// //                     <span className="font-medium">
// //                       {selectedCustomer.upgradeScore}/5
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// //               <MessageSquare className="w-4 h-4" /> Select Scenario
// //             </h3>
// //             <Select
// //               value={selectedScenario}
// //               onValueChange={(value) =>
// //                 setSelectedScenario(value as SimulationScenario)
// //               }
// //             >
// //               <SelectTrigger className="w-full rounded-xl">
// //                 <SelectValue />
// //               </SelectTrigger>
// //               <SelectContent className="rounded-xl min-w-full">
// //                 {(
// //                   Object.keys(scenarioDescriptions) as SimulationScenario[]
// //                 ).map((scenario) => (
// //                   <SelectItem key={scenario} value={scenario}>
// //                     {scenario
// //                       .replace("_", " ")
// //                       .replace(/\b\w/g, (l) => l.toUpperCase())}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //             <p className="text-xs text-muted-foreground mt-3">
// //               {scenarioDescriptions[selectedScenario]}
// //             </p>
// //           </div>

// //           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// //               <Settings className="w-4 h-4" /> AI Agent Settings
// //             </h3>
// //             <div className="space-y-3">
// //               <div>
// //                 <label className="text-xs font-medium mb-1 block">
// //                   Agent Personality
// //                 </label>
// //                 <Select defaultValue="professional">
// //                   <SelectTrigger className="w-full rounded-xl h-9">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent className="rounded-xl min-w-full">
// //                     <SelectItem value="professional">Professional</SelectItem>
// //                     <SelectItem value="friendly">Friendly</SelectItem>
// //                     <SelectItem value="casual">Casual</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <div>
// //                 <label className="text-xs font-medium mb-1 block">
// //                   Response Speed
// //                 </label>
// //                 <Select defaultValue="normal">
// //                   <SelectTrigger className="w-full rounded-xl h-9">
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent className="rounded-xl min-w-full">
// //                     <SelectItem value="fast">Fast</SelectItem>
// //                     <SelectItem value="normal">Normal</SelectItem>
// //                     <SelectItem value="slow">Slow</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             </div>
// //           </div>

// //           {/* NEW: CSV test-sheet import/export + mock booking calendar */}
// //           <SimulationCsvAndBookings
// //             serverUrl={serverUrl}
// //             onSelectCustomer={handleSelectImportedCustomer}
// //           />
// //         </div>

// //         {/* Center Panel - Conversation */}
// //         <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
// //           {/* Call Controls */}
// //           <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
// //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
// //               <div className="flex items-center gap-3">
// //                 <div
// //                   className={`w-12 h-12 rounded-full flex items-center justify-center ${isRunning ? "bg-green-500 animate-pulse" : "bg-muted"}`}
// //                 >
// //                   <Phone
// //                     className={`w-6 h-6 ${isRunning ? "text-white" : "text-muted-foreground"}`}
// //                   />
// //                 </div>
// //                 <div>
// //                   <p className="font-semibold text-foreground">
// //                     {isRunning ? "Voice Session Active" : "Ready to Start"}
// //                   </p>
// //                   <p className="text-xs text-muted-foreground">
// //                     {isRunning
// //                       ? formatDuration(callDuration)
// //                       : "No active session"}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex items-center gap-2 flex-wrap">
// //                 {!isRunning ? (
// //                   <Button
// //                     className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 w-full sm:w-auto"
// //                     onClick={handleStartSimulation}
// //                     disabled={!selectedCustomer || !voiceAgent.isConnected}
// //                   >
// //                     <Play className="w-4 h-4" /> Start Voice Session
// //                   </Button>
// //                 ) : (
// //                   <>
// //                     <Button
// //                       variant="outline"
// //                       className={`rounded-xl gap-2 ${voiceAgent.isRecording ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : ""}`}
// //                       onClick={handlePauseResume}
// //                     >
// //                       {voiceAgent.isRecording ? (
// //                         <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
// //                       ) : (
// //                         <MicOff className="w-4 h-4" />
// //                       )}
// //                       {voiceAgent.isRecording ? "Recording" : "Paused"}
// //                     </Button>
// //                     <Button
// //                       variant="outline"
// //                       className={`rounded-xl gap-2 ${voiceAgent.isPlaying ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900" : ""}`}
// //                       onClick={() => setIsMuted(!isMuted)}
// //                     >
// //                       {isMuted ? (
// //                         <VolumeX className="w-4 h-4" />
// //                       ) : (
// //                         <Volume2 className="w-4 h-4" />
// //                       )}
// //                     </Button>
// //                     <Button
// //                       variant="outline"
// //                       className="rounded-xl gap-2"
// //                       onClick={() => {
// //                         voiceAgent.endSession();
// //                         setMessages([]);
// //                         setCallDuration(0);
// //                         setSentimentScore(75);
// //                       }}
// //                     >
// //                       <RotateCcw className="w-4 h-4" /> Reset
// //                     </Button>
// //                     <Button
// //                       variant="destructive"
// //                       className="rounded-xl gap-2"
// //                       onClick={handleEndSessionClick}
// //                     >
// //                       <PhoneOff className="w-4 h-4" /> End Session
// //                     </Button>
// //                   </>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Real-time Metrics */}
// //             {isRunning && (
// //               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
// //                 <div className="text-center">
// //                   <p className="text-xs text-muted-foreground mb-1">
// //                     Sentiment
// //                   </p>
// //                   <div className="flex items-center justify-center gap-1">
// //                     <TrendingUp className="w-4 h-4 text-green-500" />
// //                     <span className="text-lg font-bold text-foreground">
// //                       {sentimentScore}%
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="text-center">
// //                   <p className="text-xs text-muted-foreground mb-1">Messages</p>
// //                   <span className="text-lg font-bold text-foreground">
// //                     {messages.length}
// //                   </span>
// //                 </div>
// //                 <div className="text-center">
// //                   <p className="text-xs text-muted-foreground mb-1">
// //                     Recording
// //                   </p>
// //                   <Badge
// //                     variant={voiceAgent.isRecording ? "default" : "secondary"}
// //                     className="rounded-lg"
// //                   >
// //                     {voiceAgent.isRecording ? "Active" : "Paused"}
// //                   </Badge>
// //                 </div>
// //                 <div className="text-center">
// //                   <p className="text-xs text-muted-foreground mb-1">
// //                     Agent Voice
// //                   </p>
// //                   <Badge
// //                     variant={voiceAgent.isPlaying ? "default" : "secondary"}
// //                     className="rounded-lg"
// //                   >
// //                     {voiceAgent.isPlaying ? "Speaking" : "Idle"}
// //                   </Badge>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Error Display */}
// //             {voiceAgent.error && (
// //               <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2">
// //                 <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
// //                 <p className="text-xs text-red-700 dark:text-red-400">
// //                   {voiceAgent.error}
// //                 </p>
// //               </div>
// //             )}
// //           </div>

// //           {/* Conversation Feed */}
// //           <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
// //             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// //               <MessageSquare className="w-4 h-4" /> Live Transcript
// //             </h3>
// //             <div className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto">
// //               <AnimatePresence>
// //                 {messages.length === 0 ? (
// //                   <div className="text-center py-12 text-muted-foreground">
// //                     <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
// //                     <p className="text-sm">
// //                       Start a voice session to see the conversation
// //                     </p>
// //                   </div>
// //                 ) : (
// //                   messages.map((message, index) => (
// //                     <motion.div
// //                       key={message.id}
// //                       initial={{ opacity: 0, y: 10 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       transition={{ delay: index * 0.05 }}
// //                       className={`flex gap-3 ${message.role === "agent" ? "justify-start" : "justify-end"}`}
// //                     >
// //                       <div
// //                         className={`flex gap-3 max-w-[80%] ${message.role === "agent" ? "flex-row" : "flex-row-reverse"}`}
// //                       >
// //                         <div
// //                           className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
// //                             message.role === "agent"
// //                               ? "bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] text-white"
// //                               : "bg-muted text-muted-foreground"
// //                           }`}
// //                         >
// //                           {message.role === "agent" ? (
// //                             <Bot className="w-4 h-4" />
// //                           ) : (
// //                             <User className="w-4 h-4" />
// //                           )}
// //                         </div>
// //                         <div
// //                           className={`space-y-1 ${message.role === "agent" ? "text-left" : "text-right"}`}
// //                         >
// //                           <div
// //                             className={`inline-block px-4 py-2 rounded-2xl text-sm ${
// //                               message.role === "agent"
// //                                 ? "bg-muted text-foreground rounded-tl-none"
// //                                 : "bg-[#0C1E3C] text-white rounded-tr-none"
// //                             }`}
// //                           >
// //                             {message.content || "..."}
// //                           </div>
// //                           <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
// //                             <Clock className="w-3 h-3" />
// //                             {formatDuration(
// //                               Math.floor(
// //                                 (Date.now() - message.timestamp.getTime()) /
// //                                   1000,
// //                               ),
// //                             )}
// //                             {message.sentiment && (
// //                               <Badge
// //                                 variant="outline"
// //                                 className="text-[10px] h-4 px-1"
// //                               >
// //                                 {message.sentiment}
// //                               </Badge>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </motion.div>
// //                   ))
// //                 )}
// //               </AnimatePresence>
// //             </div>
// //           </div>

// //           {/* Call Log Display */}
// //           {voiceAgent.callLog && (
// //             <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
// //               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// //                 <TrendingUp className="w-4 h-4" /> Call Log
// //               </h3>
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div className="p-3 bg-muted/30 rounded-xl">
// //                   <p className="text-xs text-muted-foreground mb-1">
// //                     Caller Name
// //                   </p>
// //                   <p className="text-sm font-medium">
// //                     {voiceAgent.callLog.caller_name || "N/A"}
// //                   </p>
// //                 </div>
// //                 <div className="p-3 bg-muted/30 rounded-xl">
// //                   <p className="text-xs text-muted-foreground mb-1">Intent</p>
// //                   <p className="text-sm font-medium capitalize">
// //                     {voiceAgent.callLog.intent_category?.replace("_", " ")}
// //                   </p>
// //                 </div>
// //                 <div className="p-3 bg-muted/30 rounded-xl">
// //                   <p className="text-xs text-muted-foreground mb-1">Outcome</p>
// //                   <p className="text-sm font-medium capitalize">
// //                     {voiceAgent.callLog.outcome?.replace("_", " ")}
// //                   </p>
// //                 </div>
// //                 <div className="p-3 bg-muted/30 rounded-xl">
// //                   <p className="text-xs text-muted-foreground mb-1">
// //                     Sentiment
// //                   </p>
// //                   <Badge
// //                     variant={
// //                       voiceAgent.callLog.sentiment === "positive"
// //                         ? "default"
// //                         : "secondary"
// //                     }
// //                     className="rounded-lg"
// //                   >
// //                     {voiceAgent.callLog.sentiment}
// //                   </Badge>
// //                 </div>
// //               </div>
// //               {voiceAgent.callLog.ai_summary && (
// //                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
// //                   <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
// //                     � Summary: {voiceAgent.callLog.ai_summary}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Recording Download */}
// //           {voiceAgent.recordingUrl && (
// //             <div className="bg-card rounded-2xl border border-border card-shadow p-5">
// //               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
// //                 <Bot className="w-4 h-4" /> Recording
// //               </h3>
// //               <a
// //                 href={voiceAgent.recordingUrl}
// //                 download
// //                 className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm"
// //               >
// //                 <Download className="w-4 h-4" /> Download Recording
// //               </a>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* End Session Dialog */}
// //       <AlertDialog
// //         open={showEndSessionDialog}
// //         onOpenChange={setShowEndSessionDialog}
// //       >
// //         <AlertDialogContent className="rounded-2xl">
// //           <AlertDialogHeader>
// //             <AlertDialogTitle className="flex items-center gap-2">
// //               <FileText className="w-5 h-5" />
// //               End Voice Session
// //             </AlertDialogTitle>
// //             <AlertDialogDescription>
// //               Would you like to download a summary of this session before
// //               ending?
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>

// //           {messages.length > 0 && (
// //             <div className="py-4">
// //               <div className="bg-muted/30 rounded-xl p-4 space-y-2">
// //                 <div className="flex justify-between text-sm">
// //                   <span className="text-muted-foreground">Duration</span>
// //                   <span className="font-medium">
// //                     {formatDuration(callDuration)}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between text-sm">
// //                   <span className="text-muted-foreground">Messages</span>
// //                   <span className="font-medium">{messages.length}</span>
// //                 </div>
// //                 {selectedCustomer && (
// //                   <div className="flex justify-between text-sm">
// //                     <span className="text-muted-foreground">Customer</span>
// //                     <span className="font-medium">{selectedCustomer.name}</span>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           <AlertDialogFooter className="gap-2">
// //             <AlertDialogCancel
// //               onClick={() => handleConfirmEndSession(false)}
// //               className="rounded-xl"
// //             >
// //               End Without Summary
// //             </AlertDialogCancel>
// //             <AlertDialogAction
// //               onClick={() => handleConfirmEndSession(true)}
// //               className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2"
// //             >
// //               <Download className="w-4 h-4" /> Download & End
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>
// //     </div>
// //   );
// // }
// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Play,
//   Pause,
//   RotateCcw,
//   Mic,
//   MicOff,
//   Phone,
//   PhoneOff,
//   MessageSquare,
//   User,
//   Bot,
//   Clock,
//   TrendingUp,
//   Star,
//   ChevronRight,
//   Settings,
//   BookOpen,
//   Volume2,
//   VolumeX,
//   Wifi,
//   WifiOff,
//   AlertCircle,
//   CheckCircle,
//   Download,
//   FileText,
//   X,
//   Upload,
//   Table as TableIcon,
//   CalendarCheck,
//   CalendarClock,
//   CheckCircle2,
//   XCircle,
//   Trash2,
//   PlusCircle,
//   Loader2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import type {
//   SimulationScenario,
//   SimulationMessage,
//   MockCustomer,
// } from "@/types";
// import { useVoiceAgent } from "@/hooks/useVoiceAgent";

// const mockCustomers: MockCustomer[] = [
//   {
//     name: "James Nguyen",
//     vehicle: "2021 Toyota HiLux SR5",
//     suburb: "Keysborough",
//     scenario: "service_due",
//     lastService: "2025-10-20",
//     upgradeScore: 5,
//   },
//   {
//     name: "Sarah Thompson",
//     vehicle: "2022 Mercedes GLC 300",
//     suburb: "Berwick",
//     scenario: "upgrade_opportunity",
//     lastService: "2025-09-10",
//     upgradeScore: 4,
//   },
//   {
//     name: "Michael Patel",
//     vehicle: "2020 Isuzu D-Max",
//     suburb: "Dandenong",
//     scenario: "finance_renewal",
//     lastService: "2025-08-22",
//     upgradeScore: 4,
//   },
//   {
//     name: "Lisa Moran",
//     vehicle: "2021 Toyota RAV4 Hybrid",
//     suburb: "Chadstone",
//     scenario: "objection_handling",
//     lastService: "2025-07-20",
//     upgradeScore: 3,
//   },
//   {
//     name: "Emma Chen",
//     vehicle: "2022 Mercedes C-Class",
//     suburb: "Brighton",
//     scenario: "callback_follow_up",
//     lastService: "2025-09-15",
//     upgradeScore: 5,
//   },
// ];

// const scenarioDescriptions: Record<SimulationScenario, string> = {
//   service_due: "Customer vehicle is due for scheduled service",
//   upgrade_opportunity: "High-value customer eligible for vehicle upgrade",
//   finance_renewal: "Customer finance term ending, renewal opportunity",
//   objection_handling: "Practice handling common customer objections",
//   callback_follow_up: "Follow up on previous inquiry or callback request",
// };

// const mockConversation: SimulationMessage[] = [
//   {
//     id: "1",
//     role: "agent",
//     content: "Good morning, may I please speak with James Nguyen?",
//     timestamp: new Date(Date.now() - 5000),
//     sentiment: "neutral",
//   },
//   {
//     id: "2",
//     role: "customer",
//     content: "Speaking, who's this?",
//     timestamp: new Date(Date.now() - 4000),
//     sentiment: "neutral",
//   },
//   {
//     id: "3",
//     role: "agent",
//     content:
//       "Hi James, this is Aria calling from Patterson Cheney Toyota Keysborough. How are you today?",
//     timestamp: new Date(Date.now() - 3000),
//     sentiment: "positive",
//   },
//   {
//     id: "4",
//     role: "customer",
//     content: "Yeah, good thanks. What's this about?",
//     timestamp: new Date(Date.now() - 2000),
//     sentiment: "neutral",
//   },
//   {
//     id: "5",
//     role: "agent",
//     content:
//       "I'm reaching out because your 2021 HiLux SR5 is coming up for its next scheduled service in April. I wanted to check in and see if you'd like to book it in at a time that suits you.",
//     timestamp: new Date(Date.now() - 1000),
//     sentiment: "positive",
//   },
// ];

// // ─── SimulationCsvAndBookings ──────────────────────────────────────────────
// // CSV test-sheet import/export + live mock booking calendar. Merged inline
// // here (rather than a separate file) so this is a single complete page.
// // Fulfils: "upload test sheet" (as CSV, not Google Sheet, per instruction)
// // and "mock booking calendar & confirmation UI that writes fake booking ref
// // back."
// function SimulationCsvAndBookings({
//   serverUrl,
//   onSelectCustomer,
// }: {
//   serverUrl: string;
//   onSelectCustomer: (
//     customer: MockCustomer & { id?: string; phone?: string; brand?: string },
//   ) => void;
// }) {
//   const [importResult, setImportResult] = useState<any>(null);
//   const [importing, setImporting] = useState(false);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loadingBookings, setLoadingBookings] = useState(false);
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [bookingDraft, setBookingDraft] = useState<{
//     customer_name: string;
//     phone: string;
//     vehicle: string;
//     brand: string;
//     type: "service" | "test_drive";
//     date: string;
//     time: string;
//   }>({
//     customer_name: "",
//     phone: "",
//     vehicle: "",
//     brand: "Toyota",
//     type: "service",
//     date: "",
//     time: "",
//   });
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const fetchCustomers = useCallback(async () => {
//     try {
//       const res = await fetch(`${serverUrl}/api/simulation/customers`);
//       if (res.ok) setCustomers(await res.json());
//     } catch {
//       /* server may be offline in design preview — fail quietly */
//     }
//   }, [serverUrl]);

//   const fetchBookings = useCallback(async () => {
//     setLoadingBookings(true);
//     try {
//       const res = await fetch(`${serverUrl}/api/mock-bookings`);
//       if (res.ok) setBookings(await res.json());
//     } catch {
//       /* ignore */
//     } finally {
//       setLoadingBookings(false);
//     }
//   }, [serverUrl]);

//   useEffect(() => {
//     fetchCustomers();
//     fetchBookings();
//   }, [fetchCustomers, fetchBookings]);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true);
//     setImportResult(null);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await fetch(
//         `${serverUrl}/api/simulation/customers/import-csv`,
//         {
//           method: "POST",
//           body: formData,
//         },
//       );
//       const data = await res.json();
//       setImportResult({ ok: res.ok, ...data });
//       if (res.ok) fetchCustomers();
//     } catch (err) {
//       setImportResult({
//         ok: false,
//         error: "Upload failed — check the server is reachable",
//       });
//     } finally {
//       setImporting(false);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     await fetch(`${serverUrl}/api/simulation/customers/${id}`, {
//       method: "DELETE",
//     });
//     fetchCustomers();
//   };

//   const handleCreateBooking = async () => {
//     if (!bookingDraft.customer_name || !bookingDraft.date || !bookingDraft.time)
//       return;
//     await fetch(`${serverUrl}/api/mock-bookings`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(bookingDraft),
//     });
//     setBookingDraft({
//       customer_name: "",
//       phone: "",
//       vehicle: "",
//       brand: "Toyota",
//       type: "service",
//       date: "",
//       time: "",
//     });
//     setShowBookingForm(false);
//     fetchBookings();
//   };

//   const handleCancelBooking = async (id: string) => {
//     await fetch(`${serverUrl}/api/mock-bookings/${id}/cancel`, {
//       method: "POST",
//     });
//     fetchBookings();
//   };

//   return (
//     <div className="space-y-4">
//       {/* CSV Test-Sheet Import/Export */}
//       <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
//             <TableIcon className="w-4 h-4" /> Test Sheet (CSV)
//           </h3>
//           <Badge variant="outline" className="text-[10px]">
//             {customers.length} loaded
//           </Badge>
//         </div>

//         <p className="text-xs text-muted-foreground mb-3">
//           Upload a CSV of test customers to drive the simulation — columns:{" "}
//           <code className="text-[11px] bg-muted px-1 py-0.5 rounded">
//             name, phone, vehicle, brand, suburb, scenario, lastService,
//             upgradeScore
//           </code>
//         </p>

//         <div className="flex flex-wrap gap-2 mb-3">
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             className="hidden"
//             id="csv-upload-input"
//           />
//           <Button
//             size="sm"
//             className="rounded-xl gap-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white"
//             onClick={() => fileInputRef.current?.click()}
//             disabled={importing}
//           >
//             {importing ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Upload className="w-4 h-4" />
//             )}
//             Import CSV
//           </Button>
//           <Button
//             size="sm"
//             variant="outline"
//             className="rounded-xl gap-2"
//             onClick={() =>
//               window.open(
//                 `${serverUrl}/api/simulation/customers/template-csv`,
//                 "_blank",
//               )
//             }
//           >
//             <Download className="w-4 h-4" /> Download Template
//           </Button>
//           <Button
//             size="sm"
//             variant="outline"
//             className="rounded-xl gap-2"
//             onClick={() =>
//               window.open(
//                 `${serverUrl}/api/simulation/customers/export-csv`,
//                 "_blank",
//               )
//             }
//             disabled={customers.length === 0}
//           >
//             <Download className="w-4 h-4" /> Export Loaded Rows
//           </Button>
//         </div>

//         {importResult && (
//           <div
//             className={`p-3 rounded-xl text-xs flex items-start gap-2 mb-3 ${
//               importResult.ok
//                 ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
//                 : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
//             }`}
//           >
//             {importResult.ok ? (
//               <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
//             ) : (
//               <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
//             )}
//             <div>
//               {importResult.ok ? (
//                 <>
//                   <p className="font-medium">
//                     Imported {importResult.imported} row
//                     {importResult.imported === 1 ? "" : "s"}
//                     {importResult.skipped
//                       ? `, skipped ${importResult.skipped}`
//                       : ""}
//                     .
//                   </p>
//                   {importResult.errors?.length > 0 && (
//                     <ul className="mt-1 list-disc list-inside text-muted-foreground">
//                       {importResult.errors
//                         .slice(0, 5)
//                         .map((e: string, i: number) => (
//                           <li key={i}>{e}</li>
//                         ))}
//                     </ul>
//                   )}
//                 </>
//               ) : (
//                 <p className="font-medium">
//                   {importResult.error || "Import failed"}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {customers.length > 0 && (
//           <div className="max-h-[220px] overflow-y-auto space-y-1.5">
//             {customers.map((c) => (
//               <div
//                 key={c.id}
//                 className="flex items-center justify-between gap-2 p-2.5 bg-muted/30 rounded-xl text-sm"
//               >
//                 <button
//                   className="text-left min-w-0 flex-1"
//                   onClick={() => onSelectCustomer(c)}
//                   title="Load into simulation"
//                 >
//                   <p className="font-medium truncate">{c.name}</p>
//                   <p className="text-xs text-muted-foreground truncate">
//                     {c.vehicle} · {c.scenario?.replace(/_/g, " ")}
//                   </p>
//                 </button>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   className="h-7 w-7 rounded-lg shrink-0"
//                   onClick={() => handleDeleteCustomer(c.id)}
//                 >
//                   <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Mock Booking Calendar */}
//       <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
//             <CalendarCheck className="w-4 h-4" /> Mock Booking Calendar
//           </h3>
//           <Button
//             size="sm"
//             variant="outline"
//             className="rounded-xl gap-1.5 h-7 text-xs"
//             onClick={() => setShowBookingForm((s) => !s)}
//           >
//             <PlusCircle className="w-3.5 h-3.5" /> New
//           </Button>
//         </div>

//         {showBookingForm && (
//           <div className="mb-4 p-3 bg-muted/30 rounded-xl space-y-2">
//             <input
//               className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
//               placeholder="Customer name"
//               value={bookingDraft.customer_name}
//               onChange={(e) =>
//                 setBookingDraft((d) => ({
//                   ...d,
//                   customer_name: e.target.value,
//                 }))
//               }
//             />
//             <input
//               className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
//               placeholder="Vehicle"
//               value={bookingDraft.vehicle}
//               onChange={(e) =>
//                 setBookingDraft((d) => ({ ...d, vehicle: e.target.value }))
//               }
//             />
//             <div className="grid grid-cols-2 gap-2">
//               <Select
//                 value={bookingDraft.type}
//                 onValueChange={(v) =>
//                   setBookingDraft((d) => ({
//                     ...d,
//                     type: (v ?? "service") as "service" | "test_drive",
//                   }))
//                 }
//               >
//                 <SelectTrigger className="h-8 rounded-lg text-xs">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   <SelectItem value="service">Service</SelectItem>
//                   <SelectItem value="test_drive">Test Drive</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={bookingDraft.brand}
//                 onValueChange={(v) =>
//                   setBookingDraft((d) => ({ ...d, brand: v ?? d.brand }))
//                 }
//               >
//                 <SelectTrigger className="h-8 rounded-lg text-xs">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-xl">
//                   <SelectItem value="Toyota">Toyota</SelectItem>
//                   <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
//                   <SelectItem value="Isuzu">Isuzu</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="date"
//                 className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
//                 value={bookingDraft.date}
//                 onChange={(e) =>
//                   setBookingDraft((d) => ({ ...d, date: e.target.value }))
//                 }
//               />
//               <input
//                 type="time"
//                 className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
//                 value={bookingDraft.time}
//                 onChange={(e) =>
//                   setBookingDraft((d) => ({ ...d, time: e.target.value }))
//                 }
//               />
//             </div>
//             <Button
//               size="sm"
//               className="w-full rounded-lg bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white text-xs"
//               onClick={handleCreateBooking}
//             >
//               Confirm Booking
//             </Button>
//           </div>
//         )}

//         {loadingBookings ? (
//           <div className="py-8 flex justify-center">
//             <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
//           </div>
//         ) : bookings.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-50" />
//             <p className="text-sm">No bookings written back yet</p>
//           </div>
//         ) : (
//           <div className="max-h-[280px] overflow-y-auto space-y-1.5">
//             {bookings.map((b) => (
//               <div
//                 key={b.id}
//                 className="p-2.5 bg-muted/30 rounded-xl text-sm flex items-center justify-between gap-2"
//               >
//                 <div className="min-w-0">
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium truncate">{b.customer_name}</p>
//                     <Badge variant="outline" className="text-[10px] shrink-0">
//                       {b.booking_ref}
//                     </Badge>
//                   </div>
//                   <p className="text-xs text-muted-foreground truncate">
//                     {b.vehicle || "—"} · {b.type.replace("_", " ")} · {b.date}{" "}
//                     {b.time}
//                   </p>
//                 </div>
//                 {b.status === "confirmed" ? (
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="rounded-lg h-7 text-xs shrink-0"
//                     onClick={() => handleCancelBooking(b.id)}
//                   >
//                     Cancel
//                   </Button>
//                 ) : (
//                   <Badge variant="secondary" className="text-[10px] shrink-0">
//                     Cancelled
//                   </Badge>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Call Log Export */}
//       <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//         <h3 className="text-sm font-semibold text-foreground mb-3">
//           Export Call Logs
//         </h3>
//         <Button
//           size="sm"
//           variant="outline"
//           className="rounded-xl gap-2 w-full"
//           onClick={() =>
//             window.open(`${serverUrl}/api/call-logs/export-csv`, "_blank")
//           }
//         >
//           <Download className="w-4 h-4" /> Download All Call Logs (CSV)
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default function SimulationPage() {
//   const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(
//     mockCustomers[0],
//   );
//   const [selectedScenario, setSelectedScenario] =
//     useState<SimulationScenario>("service_due");
//   const [isMuted, setIsMuted] = useState(false);
//   const [callDuration, setCallDuration] = useState(0);
//   const [messages, setMessages] = useState<SimulationMessage[]>([]);
//   const [sentimentScore, setSentimentScore] = useState(75);
//   const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
//   const [isDownloadingSummary, setIsDownloadingSummary] = useState(false);

//   const serverUrl =
//     process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "http://localhost:4051"; // Default to localhost if not set

//   const voiceAgent = useVoiceAgent({
//     serverUrl,
//     carContext: selectedCustomer?.vehicle,
//   });

//   const isRunning = voiceAgent.isConnected && voiceAgent.isRecording;
//   const isPaused = !voiceAgent.isRecording && voiceAgent.isConnected;

//   const handleStartSimulation = () => {
//     voiceAgent.startSession();
//     voiceAgent.startRecording();
//     setMessages([]);
//     setCallDuration(0);
//   };

//   const handlePauseResume = () => {
//     if (voiceAgent.isRecording) {
//       voiceAgent.stopRecording();
//     } else {
//       voiceAgent.startRecording();
//     }
//   };

//   const handleEndSessionClick = () => {
//     setShowEndSessionDialog(true);
//   };

//   const handleConfirmEndSession = async (downloadSummary: boolean = false) => {
//     voiceAgent.endSession();

//     if (downloadSummary && messages.length > 0) {
//       await downloadSessionSummary();
//     }

//     setMessages([]);
//     setCallDuration(0);
//     setSentimentScore(75);
//     setShowEndSessionDialog(false);
//   };

//   // Generates a formatted PDF report server-side (Patterson Cheney letterhead,
//   // customer info, call log, AI summary) and downloads it — replaces the old
//   // client-side .txt blob download.
//   const downloadSessionSummary = async () => {
//     setIsDownloadingSummary(true);
//     try {
//       const res = await fetch(`${serverUrl}/api/session-summary/pdf`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customer: selectedCustomer,
//           duration: callDuration,
//           callLog: voiceAgent.callLog,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`Server returned ${res.status}`);
//       }

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `voice-session-summary-${Date.now()}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Failed to download session summary PDF:", err);
//     } finally {
//       setIsDownloadingSummary(false);
//     }
//   };

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   // Load a CSV-imported row into the existing customer selector. CSV rows
//   // carry extra fields (id, phone, brand) that MockCustomer doesn't
//   // declare — spread them on anyway so useVoiceAgent / the backend can
//   // pick them up once its carContext prop is extended to accept a full
//   // customer object instead of just a vehicle string (see GAP_ANALYSIS.md
//   // §2.5 — useVoiceAgent.ts needs a small update to send `{ customer }`
//   // rather than `{ carContext }` for this to fully reach the backend).
//   const handleSelectImportedCustomer = (
//     customer: MockCustomer & { id?: string; phone?: string; brand?: string },
//   ) => {
//     setSelectedCustomer(customer);
//     setSelectedScenario(customer.scenario as SimulationScenario);
//   };

//   // Track call duration
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isRunning) {
//       interval = setInterval(() => {
//         setCallDuration((prev) => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isRunning]);

//   // Update messages with transcripts
//   useEffect(() => {
//     if (voiceAgent.transcript) {
//       setMessages((prev) => {
//         const lastMessage = prev[prev.length - 1];
//         if (lastMessage?.role === "customer") {
//           return [
//             ...prev.slice(0, -1),
//             { ...lastMessage, content: voiceAgent.transcript },
//           ];
//         }
//         return [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             role: "customer" as const,
//             content: voiceAgent.transcript,
//             timestamp: new Date(),
//             sentiment: "neutral" as const,
//           },
//         ];
//       });
//     }
//   }, [voiceAgent.transcript]);

//   useEffect(() => {
//     if (voiceAgent.agentTranscript) {
//       setMessages((prev) => {
//         const lastMessage = prev[prev.length - 1];
//         if (lastMessage?.role === "agent") {
//           return [
//             ...prev.slice(0, -1),
//             { ...lastMessage, content: voiceAgent.agentTranscript },
//           ];
//         }
//         return [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             role: "agent" as const,
//             content: voiceAgent.agentTranscript,
//             timestamp: new Date(),
//             sentiment: "positive" as const,
//           },
//         ];
//       });
//     }
//   }, [voiceAgent.agentTranscript]);

//   return (
//     <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
//             Voice Agent Simulation
//           </h1>
//           <p className="text-sm text-muted-foreground mt-0.5">
//             Test AI voice agent with real-time audio
//           </p>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl">
//             {voiceAgent.isConnected ? (
//               <CheckCircle className="w-4 h-4 text-green-500" />
//             ) : (
//               <WifiOff className="w-4 h-4 text-red-500" />
//             )}
//             <span className="text-xs font-medium">
//               {voiceAgent.isConnected ? "Connected" : "Disconnected"}
//             </span>
//           </div>
//           <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
//             <BookOpen className="w-4 h-4" /> Training Guide
//           </Button>
//           <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
//             <Settings className="w-4 h-4" /> Settings
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Panel - Configuration */}
//         <div className="space-y-4 order-2 lg:order-1">
//           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//               <User className="w-4 h-4" /> Select Customer
//             </h3>
//             <Select
//               value={selectedCustomer?.name}
//               onValueChange={(value) => {
//                 const customer = mockCustomers.find((c) => c.name === value);
//                 setSelectedCustomer(customer || null);
//               }}
//             >
//               <SelectTrigger className="w-full rounded-xl">
//                 <SelectValue placeholder="Choose a customer" />
//               </SelectTrigger>
//               <SelectContent className="rounded-xl min-w-full">
//                 {mockCustomers.map((customer) => (
//                   <SelectItem key={customer.name} value={customer.name}>
//                     <div className="flex flex-col">
//                       <span className="font-medium">{customer.name}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {customer.vehicle}
//                       </span>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {selectedCustomer && (
//               <div className="mt-4 p-4 bg-muted/30 rounded-xl space-y-2">
//                 <div className="flex justify-between text-sm min-w-0">
//                   <span className="text-muted-foreground">Vehicle</span>
//                   <span className="font-medium text-right truncate min-w-0 ml-4">
//                     {selectedCustomer.vehicle}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm min-w-0">
//                   <span className="text-muted-foreground">Location</span>
//                   <span className="font-medium text-right truncate min-w-0 ml-4">
//                     {selectedCustomer.suburb}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm min-w-0">
//                   <span className="text-muted-foreground">Last Service</span>
//                   <span className="font-medium text-right truncate min-w-0 ml-4">
//                     {selectedCustomer.lastService}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm items-center">
//                   <span className="text-muted-foreground">Upgrade Score</span>
//                   <div className="flex items-center gap-1">
//                     <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
//                     <span className="font-medium">
//                       {selectedCustomer.upgradeScore}/5
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//               <MessageSquare className="w-4 h-4" /> Select Scenario
//             </h3>
//             <Select
//               value={selectedScenario}
//               onValueChange={(value) =>
//                 setSelectedScenario(value as SimulationScenario)
//               }
//             >
//               <SelectTrigger className="w-full rounded-xl">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent className="rounded-xl min-w-full">
//                 {(
//                   Object.keys(scenarioDescriptions) as SimulationScenario[]
//                 ).map((scenario) => (
//                   <SelectItem key={scenario} value={scenario}>
//                     {scenario
//                       .replace("_", " ")
//                       .replace(/\b\w/g, (l) => l.toUpperCase())}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <p className="text-xs text-muted-foreground mt-3">
//               {scenarioDescriptions[selectedScenario]}
//             </p>
//           </div>

//           <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//               <Settings className="w-4 h-4" /> AI Agent Settings
//             </h3>
//             <div className="space-y-3">
//               <div>
//                 <label className="text-xs font-medium mb-1 block">
//                   Agent Personality
//                 </label>
//                 <Select defaultValue="professional">
//                   <SelectTrigger className="w-full rounded-xl h-9">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl min-w-full">
//                     <SelectItem value="professional">Professional</SelectItem>
//                     <SelectItem value="friendly">Friendly</SelectItem>
//                     <SelectItem value="casual">Casual</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <label className="text-xs font-medium mb-1 block">
//                   Response Speed
//                 </label>
//                 <Select defaultValue="normal">
//                   <SelectTrigger className="w-full rounded-xl h-9">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-xl min-w-full">
//                     <SelectItem value="fast">Fast</SelectItem>
//                     <SelectItem value="normal">Normal</SelectItem>
//                     <SelectItem value="slow">Slow</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* NEW: CSV test-sheet import/export + mock booking calendar */}
//           <SimulationCsvAndBookings
//             serverUrl={serverUrl}
//             onSelectCustomer={handleSelectImportedCustomer}
//           />
//         </div>

//         {/* Center Panel - Conversation */}
//         <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
//           {/* Call Controls */}
//           <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center ${isRunning ? "bg-green-500 animate-pulse" : "bg-muted"}`}
//                 >
//                   <Phone
//                     className={`w-6 h-6 ${isRunning ? "text-white" : "text-muted-foreground"}`}
//                   />
//                 </div>
//                 <div>
//                   <p className="font-semibold text-foreground">
//                     {isRunning ? "Voice Session Active" : "Ready to Start"}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {isRunning
//                       ? formatDuration(callDuration)
//                       : "No active session"}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {!isRunning ? (
//                   <Button
//                     className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 w-full sm:w-auto"
//                     onClick={handleStartSimulation}
//                     disabled={!selectedCustomer || !voiceAgent.isConnected}
//                   >
//                     <Play className="w-4 h-4" /> Start Voice Session
//                   </Button>
//                 ) : (
//                   <>
//                     <Button
//                       variant="outline"
//                       className={`rounded-xl gap-2 ${voiceAgent.isRecording ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : ""}`}
//                       onClick={handlePauseResume}
//                     >
//                       {voiceAgent.isRecording ? (
//                         <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
//                       ) : (
//                         <MicOff className="w-4 h-4" />
//                       )}
//                       {voiceAgent.isRecording ? "Recording" : "Paused"}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className={`rounded-xl gap-2 ${voiceAgent.isPlaying ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900" : ""}`}
//                       onClick={() => setIsMuted(!isMuted)}
//                     >
//                       {isMuted ? (
//                         <VolumeX className="w-4 h-4" />
//                       ) : (
//                         <Volume2 className="w-4 h-4" />
//                       )}
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="rounded-xl gap-2"
//                       onClick={() => {
//                         voiceAgent.endSession();
//                         setMessages([]);
//                         setCallDuration(0);
//                         setSentimentScore(75);
//                       }}
//                     >
//                       <RotateCcw className="w-4 h-4" /> Reset
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       className="rounded-xl gap-2"
//                       onClick={handleEndSessionClick}
//                     >
//                       <PhoneOff className="w-4 h-4" /> End Session
//                     </Button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Real-time Metrics */}
//             {isRunning && (
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
//                 <div className="text-center">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Sentiment
//                   </p>
//                   <div className="flex items-center justify-center gap-1">
//                     <TrendingUp className="w-4 h-4 text-green-500" />
//                     <span className="text-lg font-bold text-foreground">
//                       {sentimentScore}%
//                     </span>
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-xs text-muted-foreground mb-1">Messages</p>
//                   <span className="text-lg font-bold text-foreground">
//                     {messages.length}
//                   </span>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Recording
//                   </p>
//                   <Badge
//                     variant={voiceAgent.isRecording ? "default" : "secondary"}
//                     className="rounded-lg"
//                   >
//                     {voiceAgent.isRecording ? "Active" : "Paused"}
//                   </Badge>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Agent Voice
//                   </p>
//                   <Badge
//                     variant={voiceAgent.isPlaying ? "default" : "secondary"}
//                     className="rounded-lg"
//                   >
//                     {voiceAgent.isPlaying ? "Speaking" : "Idle"}
//                   </Badge>
//                 </div>
//               </div>
//             )}

//             {/* Error Display */}
//             {voiceAgent.error && (
//               <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
//                 <p className="text-xs text-red-700 dark:text-red-400">
//                   {voiceAgent.error}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Conversation Feed */}
//           <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
//             <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//               <MessageSquare className="w-4 h-4" /> Live Transcript
//             </h3>
//             <div className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto">
//               <AnimatePresence>
//                 {messages.length === 0 ? (
//                   <div className="text-center py-12 text-muted-foreground">
//                     <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                     <p className="text-sm">
//                       Start a voice session to see the conversation
//                     </p>
//                   </div>
//                 ) : (
//                   messages.map((message, index) => (
//                     <motion.div
//                       key={message.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className={`flex gap-3 ${message.role === "agent" ? "justify-start" : "justify-end"}`}
//                     >
//                       <div
//                         className={`flex gap-3 max-w-[80%] ${message.role === "agent" ? "flex-row" : "flex-row-reverse"}`}
//                       >
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
//                             message.role === "agent"
//                               ? "bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] text-white"
//                               : "bg-muted text-muted-foreground"
//                           }`}
//                         >
//                           {message.role === "agent" ? (
//                             <Bot className="w-4 h-4" />
//                           ) : (
//                             <User className="w-4 h-4" />
//                           )}
//                         </div>
//                         <div
//                           className={`space-y-1 ${message.role === "agent" ? "text-left" : "text-right"}`}
//                         >
//                           <div
//                             className={`inline-block px-4 py-2 rounded-2xl text-sm ${
//                               message.role === "agent"
//                                 ? "bg-muted text-foreground rounded-tl-none"
//                                 : "bg-[#0C1E3C] text-white rounded-tr-none"
//                             }`}
//                           >
//                             {message.content || "..."}
//                           </div>
//                           <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
//                             <Clock className="w-3 h-3" />
//                             {formatDuration(
//                               Math.floor(
//                                 (Date.now() - message.timestamp.getTime()) /
//                                   1000,
//                               ),
//                             )}
//                             {message.sentiment && (
//                               <Badge
//                                 variant="outline"
//                                 className="text-[10px] h-4 px-1"
//                               >
//                                 {message.sentiment}
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Call Log Display */}
//           {voiceAgent.callLog && (
//             <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
//               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4" /> Call Log
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="p-3 bg-muted/30 rounded-xl">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Caller Name
//                   </p>
//                   <p className="text-sm font-medium">
//                     {voiceAgent.callLog.caller_name || "N/A"}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-muted/30 rounded-xl">
//                   <p className="text-xs text-muted-foreground mb-1">Intent</p>
//                   <p className="text-sm font-medium capitalize">
//                     {voiceAgent.callLog.intent_category?.replace("_", " ")}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-muted/30 rounded-xl">
//                   <p className="text-xs text-muted-foreground mb-1">Outcome</p>
//                   <p className="text-sm font-medium capitalize">
//                     {voiceAgent.callLog.outcome?.replace("_", " ")}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-muted/30 rounded-xl">
//                   <p className="text-xs text-muted-foreground mb-1">
//                     Sentiment
//                   </p>
//                   <Badge
//                     variant={
//                       voiceAgent.callLog.sentiment === "positive"
//                         ? "default"
//                         : "secondary"
//                     }
//                     className="rounded-lg"
//                   >
//                     {voiceAgent.callLog.sentiment}
//                   </Badge>
//                 </div>
//               </div>
//               {voiceAgent.callLog.ai_summary && (
//                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
//                   <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
//                     � Summary: {voiceAgent.callLog.ai_summary}
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Recording Download */}
//           {voiceAgent.recordingUrl && (
//             <div className="bg-card rounded-2xl border border-border card-shadow p-5">
//               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//                 <Bot className="w-4 h-4" /> Recording
//               </h3>
//               <a
//                 href={voiceAgent.recordingUrl}
//                 download
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm"
//               >
//                 <Download className="w-4 h-4" /> Download Recording
//               </a>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* End Session Dialog */}
//       <AlertDialog
//         open={showEndSessionDialog}
//         onOpenChange={setShowEndSessionDialog}
//       >
//         <AlertDialogContent className="rounded-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <FileText className="w-5 h-5" />
//               End Voice Session
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Would you like to download a summary of this session before
//               ending?
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           {messages.length > 0 && (
//             <div className="py-4">
//               <div className="bg-muted/30 rounded-xl p-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Duration</span>
//                   <span className="font-medium">
//                     {formatDuration(callDuration)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-foreground">Messages</span>
//                   <span className="font-medium">{messages.length}</span>
//                 </div>
//                 {selectedCustomer && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Customer</span>
//                     <span className="font-medium">{selectedCustomer.name}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <AlertDialogFooter className="gap-2">
//             <AlertDialogCancel
//               onClick={() => handleConfirmEndSession(false)}
//               className="rounded-xl"
//             >
//               End Without Summary
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => handleConfirmEndSession(true)}
//               disabled={isDownloadingSummary}
//               className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2"
//             >
//               {isDownloadingSummary ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <Download className="w-4 h-4" />
//               )}
//               Download & End
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  User,
  Bot,
  Clock,
  TrendingUp,
  Star,
  ChevronRight,
  Settings,
  BookOpen,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  X,
  Upload,
  Table as TableIcon,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Trash2,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type {
  SimulationScenario,
  SimulationMessage,
  MockCustomer,
} from "@/types";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

const mockCustomers: MockCustomer[] = [
  {
    name: "James Nguyen",
    vehicle: "2021 Toyota HiLux SR5",
    suburb: "Keysborough",
    scenario: "service_due",
    lastService: "2025-10-20",
    upgradeScore: 5,
  },
  {
    name: "Sarah Thompson",
    vehicle: "2022 Mercedes GLC 300",
    suburb: "Berwick",
    scenario: "upgrade_opportunity",
    lastService: "2025-09-10",
    upgradeScore: 4,
  },
  {
    name: "Michael Patel",
    vehicle: "2020 Isuzu D-Max",
    suburb: "Dandenong",
    scenario: "finance_renewal",
    lastService: "2025-08-22",
    upgradeScore: 4,
  },
  {
    name: "Lisa Moran",
    vehicle: "2021 Toyota RAV4 Hybrid",
    suburb: "Chadstone",
    scenario: "objection_handling",
    lastService: "2025-07-20",
    upgradeScore: 3,
  },
  {
    name: "Emma Chen",
    vehicle: "2022 Mercedes C-Class",
    suburb: "Brighton",
    scenario: "callback_follow_up",
    lastService: "2025-09-15",
    upgradeScore: 5,
  },
];

const scenarioDescriptions: Record<SimulationScenario, string> = {
  service_due: "Customer vehicle is due for scheduled service",
  upgrade_opportunity: "High-value customer eligible for vehicle upgrade",
  finance_renewal: "Customer finance term ending, renewal opportunity",
  objection_handling: "Practice handling common customer objections",
  callback_follow_up: "Follow up on previous inquiry or callback request",
};

const mockConversation: SimulationMessage[] = [
  {
    id: "1",
    role: "agent",
    content: "Good morning, may I please speak with James Nguyen?",
    timestamp: new Date(Date.now() - 5000),
    sentiment: "neutral",
  },
  {
    id: "2",
    role: "customer",
    content: "Speaking, who's this?",
    timestamp: new Date(Date.now() - 4000),
    sentiment: "neutral",
  },
  {
    id: "3",
    role: "agent",
    content:
      "Hi James, this is Aria calling from Patterson Cheney Toyota Keysborough. How are you today?",
    timestamp: new Date(Date.now() - 3000),
    sentiment: "positive",
  },
  {
    id: "4",
    role: "customer",
    content: "Yeah, good thanks. What's this about?",
    timestamp: new Date(Date.now() - 2000),
    sentiment: "neutral",
  },
  {
    id: "5",
    role: "agent",
    content:
      "I'm reaching out because your 2021 HiLux SR5 is coming up for its next scheduled service in April. I wanted to check in and see if you'd like to book it in at a time that suits you.",
    timestamp: new Date(Date.now() - 1000),
    sentiment: "positive",
  },
];

// ─── SimulationCsvAndBookings ──────────────────────────────────────────────
// CSV test-sheet import/export + live mock booking calendar. Merged inline
// here (rather than a separate file) so this is a single complete page.
// Fulfils: "upload test sheet" (as CSV, not Google Sheet, per instruction)
// and "mock booking calendar & confirmation UI that writes fake booking ref
// back."
function SimulationCsvAndBookings({
  serverUrl,
  onSelectCustomer,
}: {
  serverUrl: string;
  onSelectCustomer: (
    customer: MockCustomer & { id?: string; phone?: string; brand?: string },
  ) => void;
}) {
  const [importResult, setImportResult] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<{
    customer_name: string;
    phone: string;
    vehicle: string;
    brand: string;
    type: "service" | "test_drive";
    date: string;
    time: string;
  }>({
    customer_name: "",
    phone: "",
    vehicle: "",
    brand: "Toyota",
    type: "service",
    date: "",
    time: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch(`${serverUrl}/api/simulation/customers`);
      if (res.ok) setCustomers(await res.json());
    } catch {
      /* server may be offline in design preview — fail quietly */
    }
  }, [serverUrl]);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch(`${serverUrl}/api/mock-bookings`);
      if (res.ok) setBookings(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoadingBookings(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchCustomers();
    fetchBookings();
  }, [fetchCustomers, fetchBookings]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `${serverUrl}/api/simulation/customers/import-csv`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      setImportResult({ ok: res.ok, ...data });
      if (res.ok) fetchCustomers();
    } catch (err) {
      setImportResult({
        ok: false,
        error: "Upload failed — check the server is reachable",
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    await fetch(`${serverUrl}/api/simulation/customers/${id}`, {
      method: "DELETE",
    });
    fetchCustomers();
  };

  const handleCreateBooking = async () => {
    if (!bookingDraft.customer_name || !bookingDraft.date || !bookingDraft.time)
      return;
    await fetch(`${serverUrl}/api/mock-bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingDraft),
    });
    setBookingDraft({
      customer_name: "",
      phone: "",
      vehicle: "",
      brand: "Toyota",
      type: "service",
      date: "",
      time: "",
    });
    setShowBookingForm(false);
    fetchBookings();
  };

  const handleCancelBooking = async (id: string) => {
    await fetch(`${serverUrl}/api/mock-bookings/${id}/cancel`, {
      method: "POST",
    });
    fetchBookings();
  };

  return (
    <div className="space-y-4">
      {/* CSV Test-Sheet Import/Export */}
      <div className="bg-card rounded-2xl border border-border card-shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TableIcon className="w-4 h-4" /> Test Sheet (CSV)
          </h3>
          <Badge variant="outline" className="text-[10px]">
            {customers.length} loaded
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          Upload a CSV of test customers to drive the simulation — columns:{" "}
          <code className="text-[11px] bg-muted px-1 py-0.5 rounded">
            name, phone, vehicle, brand, suburb, scenario, lastService,
            upgradeScore
          </code>
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload-input"
          />
          <Button
            size="sm"
            className="rounded-xl gap-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Import CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() =>
              window.open(
                `${serverUrl}/api/simulation/customers/template-csv`,
                "_blank",
              )
            }
          >
            <Download className="w-4 h-4" /> Download Template
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() =>
              window.open(
                `${serverUrl}/api/simulation/customers/export-csv`,
                "_blank",
              )
            }
            disabled={customers.length === 0}
          >
            <Download className="w-4 h-4" /> Export Loaded Rows
          </Button>
        </div>

        {importResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2 mb-3 ${
              importResult.ok
                ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
            }`}
          >
            {importResult.ok ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              {importResult.ok ? (
                <>
                  <p className="font-medium">
                    Imported {importResult.imported} row
                    {importResult.imported === 1 ? "" : "s"}
                    {importResult.skipped
                      ? `, skipped ${importResult.skipped}`
                      : ""}
                    .
                  </p>
                  {importResult.errors?.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-muted-foreground">
                      {importResult.errors
                        .slice(0, 5)
                        .map((e: string, i: number) => (
                          <li key={i}>{e}</li>
                        ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="font-medium">
                  {importResult.error || "Import failed"}
                </p>
              )}
            </div>
          </div>
        )}

        {customers.length > 0 && (
          <div className="max-h-[220px] overflow-y-auto space-y-1.5">
            {customers.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 p-2.5 bg-muted/30 rounded-xl text-sm"
              >
                <button
                  className="text-left min-w-0 flex-1"
                  onClick={() => onSelectCustomer(c)}
                  title="Load into simulation"
                >
                  <p className="font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.vehicle} · {c.scenario?.replace(/_/g, " ")}
                  </p>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-lg shrink-0"
                  onClick={() => handleDeleteCustomer(c.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mock Booking Calendar */}
      <div className="bg-card rounded-2xl border border-border card-shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CalendarCheck className="w-4 h-4" /> Mock Booking Calendar
          </h3>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl gap-1.5 h-7 text-xs"
            onClick={() => setShowBookingForm((s) => !s)}
          >
            <PlusCircle className="w-3.5 h-3.5" /> New
          </Button>
        </div>

        {showBookingForm && (
          <div className="mb-4 p-3 bg-muted/30 rounded-xl space-y-2">
            <input
              className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
              placeholder="Customer name"
              value={bookingDraft.customer_name}
              onChange={(e) =>
                setBookingDraft((d) => ({
                  ...d,
                  customer_name: e.target.value,
                }))
              }
            />
            <input
              className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
              placeholder="Vehicle"
              value={bookingDraft.vehicle}
              onChange={(e) =>
                setBookingDraft((d) => ({ ...d, vehicle: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={bookingDraft.type}
                onValueChange={(v) =>
                  setBookingDraft((d) => ({
                    ...d,
                    type: (v ?? "service") as "service" | "test_drive",
                  }))
                }
              >
                <SelectTrigger className="h-8 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="test_drive">Test Drive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={bookingDraft.brand}
                onValueChange={(v) =>
                  setBookingDraft((d) => ({ ...d, brand: v ?? d.brand }))
                }
              >
                <SelectTrigger className="h-8 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="Isuzu">Isuzu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="date"
                className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
                value={bookingDraft.date}
                onChange={(e) =>
                  setBookingDraft((d) => ({ ...d, date: e.target.value }))
                }
              />
              <input
                type="time"
                className="w-full h-8 rounded-lg border border-border bg-background px-2 text-xs"
                value={bookingDraft.time}
                onChange={(e) =>
                  setBookingDraft((d) => ({ ...d, time: e.target.value }))
                }
              />
            </div>
            <Button
              size="sm"
              className="w-full rounded-lg bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white text-xs"
              onClick={handleCreateBooking}
            >
              Confirm Booking
            </Button>
          </div>
        )}

        {loadingBookings ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No bookings written back yet</p>
          </div>
        ) : (
          <div className="max-h-[280px] overflow-y-auto space-y-1.5">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-2.5 bg-muted/30 rounded-xl text-sm flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{b.customer_name}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {b.booking_ref}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {b.vehicle || "—"} · {b.type.replace("_", " ")} · {b.date}{" "}
                    {b.time}
                  </p>
                </div>
                {b.status === "confirmed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg h-7 text-xs shrink-0"
                    onClick={() => handleCancelBooking(b.id)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    Cancelled
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call Log Export */}
      <div className="bg-card rounded-2xl border border-border card-shadow p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Export Call Logs
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl gap-2 w-full"
          onClick={() =>
            window.open(`${serverUrl}/api/call-logs/export-csv`, "_blank")
          }
        >
          <Download className="w-4 h-4" /> Download All Call Logs (CSV)
        </Button>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<MockCustomer | null>(
    mockCustomers[0],
  );
  const [selectedScenario, setSelectedScenario] =
    useState<SimulationScenario>("service_due");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<SimulationMessage[]>([]);
  const [sentimentScore, setSentimentScore] = useState(75);
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [isDownloadingSummary, setIsDownloadingSummary] = useState(false);

  const serverUrl =
    process.env.NEXT_PUBLIC_VOICE_AGENT_URL || "https://patterson-voice.omnisuiteai.com"; // Default to localhost if not set

  const voiceAgent = useVoiceAgent({
    serverUrl,
    carContext: selectedCustomer?.vehicle,
  });

  const isRunning = voiceAgent.isConnected && voiceAgent.isRecording;
  const isPaused = !voiceAgent.isRecording && voiceAgent.isConnected;

  const handleStartSimulation = () => {
    voiceAgent.startSession();
    voiceAgent.startRecording();
    setMessages([]);
    setCallDuration(0);
  };

  const handlePauseResume = () => {
    if (voiceAgent.isRecording) {
      voiceAgent.stopRecording();
    } else {
      voiceAgent.startRecording();
    }
  };

  const handleEndSessionClick = () => {
    setShowEndSessionDialog(true);
  };

  const handleConfirmEndSession = async (downloadSummary: boolean = false) => {
    voiceAgent.endSession();

    if (downloadSummary && messages.length > 0) {
      await downloadSessionSummary();
    }

    setMessages([]);
    setCallDuration(0);
    setSentimentScore(75);
    setShowEndSessionDialog(false);
  };

  // Generates a formatted PDF report server-side (Patterson Cheney letterhead,
  // customer info, call log, AI summary) and downloads it — replaces the old
  // client-side .txt blob download.
  const downloadSessionSummary = async () => {
    setIsDownloadingSummary(true);
    try {
      const res = await fetch(`${serverUrl}/api/session-summary/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: selectedCustomer,
          duration: callDuration,
          callLog: voiceAgent.callLog,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voice-session-summary-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download session summary PDF:", err);
    } finally {
      setIsDownloadingSummary(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Load a CSV-imported row into the existing customer selector. CSV rows
  // carry extra fields (id, phone, brand) that MockCustomer doesn't
  // declare — spread them on anyway so useVoiceAgent / the backend can
  // pick them up once its carContext prop is extended to accept a full
  // customer object instead of just a vehicle string (see GAP_ANALYSIS.md
  // §2.5 — useVoiceAgent.ts needs a small update to send `{ customer }`
  // rather than `{ carContext }` for this to fully reach the backend).
  const handleSelectImportedCustomer = (
    customer: MockCustomer & { id?: string; phone?: string; brand?: string },
  ) => {
    setSelectedCustomer(customer);
    setSelectedScenario(customer.scenario as SimulationScenario);
  };

  // Track call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Update messages with transcripts
  useEffect(() => {
    if (voiceAgent.transcript) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "customer") {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: voiceAgent.transcript },
          ];
        }
        return [
          ...prev,
          {
            id: Date.now().toString(),
            role: "customer" as const,
            content: voiceAgent.transcript,
            timestamp: new Date(),
            sentiment: "neutral" as const,
          },
        ];
      });
    }
  }, [voiceAgent.transcript]);

  useEffect(() => {
    if (voiceAgent.agentTranscript) {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "agent") {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: voiceAgent.agentTranscript },
          ];
        }
        return [
          ...prev,
          {
            id: Date.now().toString(),
            role: "agent" as const,
            content: voiceAgent.agentTranscript,
            timestamp: new Date(),
            sentiment: "positive" as const,
          },
        ];
      });
    }
  }, [voiceAgent.agentTranscript]);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
            Voice Agent Simulation
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Test AI voice agent with real-time audio
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl">
            {voiceAgent.isConnected ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs font-medium">
              {voiceAgent.isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
            <BookOpen className="w-4 h-4" /> Training Guide
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 hidden sm:flex">
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4 order-2 lg:order-1">
          <div className="bg-card rounded-2xl border border-border card-shadow p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Select Customer
            </h3>
            <Select
              value={selectedCustomer?.name}
              onValueChange={(value) => {
                const customer = mockCustomers.find((c) => c.name === value);
                setSelectedCustomer(customer || null);
              }}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent className="rounded-xl min-w-full">
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.name} value={customer.name}>
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {customer.vehicle}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCustomer && (
              <div className="mt-4 p-4 bg-muted/30 rounded-xl space-y-2">
                <div className="flex justify-between text-sm min-w-0">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium text-right truncate min-w-0 ml-4">
                    {selectedCustomer.vehicle}
                  </span>
                </div>
                <div className="flex justify-between text-sm min-w-0">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-right truncate min-w-0 ml-4">
                    {selectedCustomer.suburb}
                  </span>
                </div>
                <div className="flex justify-between text-sm min-w-0">
                  <span className="text-muted-foreground">Last Service</span>
                  <span className="font-medium text-right truncate min-w-0 ml-4">
                    {selectedCustomer.lastService}
                  </span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Upgrade Score</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium">
                      {selectedCustomer.upgradeScore}/5
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl border border-border card-shadow p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Select Scenario
            </h3>
            <Select
              value={selectedScenario}
              onValueChange={(value) =>
                setSelectedScenario(value as SimulationScenario)
              }
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl min-w-full">
                {(
                  Object.keys(scenarioDescriptions) as SimulationScenario[]
                ).map((scenario) => (
                  <SelectItem key={scenario} value={scenario}>
                    {scenario
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-3">
              {scenarioDescriptions[selectedScenario]}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border card-shadow p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> AI Agent Settings
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Agent Personality
                </label>
                <Select defaultValue="professional">
                  <SelectTrigger className="w-full rounded-xl h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl min-w-full">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block">
                  Response Speed
                </label>
                <Select defaultValue="normal">
                  <SelectTrigger className="w-full rounded-xl h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl min-w-full">
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="slow">Slow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* NEW: CSV test-sheet import/export + mock booking calendar */}
          <SimulationCsvAndBookings
            serverUrl={serverUrl}
            onSelectCustomer={handleSelectImportedCustomer}
          />
        </div>

        {/* Center Panel - Conversation */}
        <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
          {/* Call Controls */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${isRunning ? "bg-green-500 animate-pulse" : "bg-muted"}`}
                >
                  <Phone
                    className={`w-6 h-6 ${isRunning ? "text-white" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isRunning ? "Voice Session Active" : "Ready to Start"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isRunning
                      ? formatDuration(callDuration)
                      : "No active session"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {!isRunning ? (
                  <Button
                    className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2 w-full sm:w-auto"
                    onClick={handleStartSimulation}
                    disabled={!selectedCustomer || !voiceAgent.isConnected}
                  >
                    <Play className="w-4 h-4" /> Start Voice Session
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className={`rounded-xl gap-2 ${voiceAgent.isRecording ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : ""}`}
                      onClick={handlePauseResume}
                    >
                      {voiceAgent.isRecording ? (
                        <Mic className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}
                      {voiceAgent.isRecording ? "Recording" : "Paused"}
                    </Button>
                    <Button
                      variant="outline"
                      className={`rounded-xl gap-2 ${voiceAgent.isPlaying ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900" : ""}`}
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl gap-2"
                      onClick={() => {
                        voiceAgent.endSession();
                        setMessages([]);
                        setCallDuration(0);
                        setSentimentScore(75);
                      }}
                    >
                      <RotateCcw className="w-4 h-4" /> Reset
                    </Button>
                    <Button
                      variant="destructive"
                      className="rounded-xl gap-2"
                      onClick={handleEndSessionClick}
                    >
                      <PhoneOff className="w-4 h-4" /> End Session
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Real-time Metrics */}
            {isRunning && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Sentiment
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-lg font-bold text-foreground">
                      {sentimentScore}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Messages</p>
                  <span className="text-lg font-bold text-foreground">
                    {messages.length}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Recording
                  </p>
                  <Badge
                    variant={voiceAgent.isRecording ? "default" : "secondary"}
                    className="rounded-lg"
                  >
                    {voiceAgent.isRecording ? "Active" : "Paused"}
                  </Badge>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Agent Voice
                  </p>
                  <Badge
                    variant={voiceAgent.isPlaying ? "default" : "secondary"}
                    className="rounded-lg"
                  >
                    {voiceAgent.isPlaying ? "Speaking" : "Idle"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Error Display */}
            {voiceAgent.error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-xs text-red-700 dark:text-red-400">
                  {voiceAgent.error}
                </p>
              </div>
            )}
          </div>

          {/* Conversation Feed */}
          <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Live Transcript
            </h3>
            <div className="space-y-3 max-h-[300px] lg:max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      Start a voice session to see the conversation
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${message.role === "agent" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${message.role === "agent" ? "flex-row" : "flex-row-reverse"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            message.role === "agent"
                              ? "bg-gradient-to-br from-[#0C1E3C] to-[#00B4D8] text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {message.role === "agent" ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div
                          className={`space-y-1 ${message.role === "agent" ? "text-left" : "text-right"}`}
                        >
                          <div
                            className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                              message.role === "agent"
                                ? "bg-muted text-foreground rounded-tl-none"
                                : "bg-[#0C1E3C] text-white rounded-tr-none"
                            }`}
                          >
                            {message.content || "..."}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDuration(
                              Math.floor(
                                (Date.now() - message.timestamp.getTime()) /
                                  1000,
                              ),
                            )}
                            {message.sentiment && (
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 px-1"
                              >
                                {message.sentiment}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Call Log Display */}
          {voiceAgent.callLog && (
            <div className="bg-card rounded-2xl border border-border card-shadow p-4 lg:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Call Log
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">
                    Caller Name
                  </p>
                  <p className="text-sm font-medium">
                    {voiceAgent.callLog.caller_name || "N/A"}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Intent</p>
                  <p className="text-sm font-medium capitalize">
                    {voiceAgent.callLog.intent_category?.replace("_", " ")}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Outcome</p>
                  <p className="text-sm font-medium capitalize">
                    {voiceAgent.callLog.outcome?.replace("_", " ")}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">
                    Sentiment
                  </p>
                  <Badge
                    variant={
                      voiceAgent.callLog.sentiment === "positive"
                        ? "default"
                        : "secondary"
                    }
                    className="rounded-lg"
                  >
                    {voiceAgent.callLog.sentiment}
                  </Badge>
                </div>
              </div>
              {voiceAgent.callLog.ai_summary && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                    � Summary: {voiceAgent.callLog.ai_summary}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recording Download */}
          {voiceAgent.recordingUrl && (
            <div className="bg-card rounded-2xl border border-border card-shadow p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bot className="w-4 h-4" /> Recording
              </h3>
              <a
                href={voiceAgent.recordingUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl text-sm"
              >
                <Download className="w-4 h-4" /> Download Recording
              </a>
            </div>
          )}
        </div>
      </div>

      {/* End Session Dialog */}
      <AlertDialog
        open={showEndSessionDialog}
        onOpenChange={setShowEndSessionDialog}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              End Voice Session
            </AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to download a summary of this session before
              ending?
            </AlertDialogDescription>
          </AlertDialogHeader>

          {messages.length > 0 && (
            <div className="py-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {formatDuration(callDuration)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Messages</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                {selectedCustomer && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{selectedCustomer.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => handleConfirmEndSession(false)}
              className="rounded-xl"
            >
              End Without Summary
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleConfirmEndSession(true)}
              disabled={isDownloadingSummary}
              className="bg-[#0C1E3C] hover:bg-[#1A3A6B] text-white rounded-xl gap-2"
            >
              {isDownloadingSummary ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download & End
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
