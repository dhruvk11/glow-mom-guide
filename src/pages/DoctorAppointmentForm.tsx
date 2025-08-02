import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const specialties = [
  "OB/GYN",
  "Pediatrician", 
  "Nutritionist",
  "Endocrinologist",
  "Psychiatrist",
  "Cardiologist",
  "Dermatologist",
  "Other"
];

const appointmentTypes = [
  "Prenatal Checkup",
  "Ultrasound Scan", 
  "Blood Test",
  "Glucose Screening",
  "Genetic Screening",
  "Anatomy Scan",
  "Growth Scan",
  "Non-Stress Test",
  "Other"
];

export default function DoctorAppointmentForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "",
    date: undefined as Date | undefined,
    time: "",
    appointmentTypes: [] as string[],
    otherType: "",
    notes: "",
    location: "",
    phoneNumber: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      appointmentTypes: prev.appointmentTypes.includes(type)
        ? prev.appointmentTypes.filter(t => t !== type)
        : [...prev.appointmentTypes, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorName || !formData.specialty || !formData.date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in doctor name, specialty, and appointment date",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const task = {
        id: Date.now().toString(),
        type: 'doctor-appointment' as const,
        title: `${formData.doctorName} - ${formData.specialty}`,
        date: formData.date.toISOString(),
        time: formData.time,
        status: 'pending' as const,
        data: {
          ...formData,
          appointmentTypes: formData.appointmentTypes.includes('Other') 
            ? [...formData.appointmentTypes.filter(t => t !== 'Other'), formData.otherType]
            : formData.appointmentTypes
        },
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
      existingTasks.push(task);
      localStorage.setItem('wellness-tasks', JSON.stringify(existingTasks));

      toast({
        title: "Appointment scheduled! 📅",
        description: `Your appointment with ${formData.doctorName} has been added to your tasks`,
        duration: 5000,
      });

      navigate('/my-tasks');
    } catch (error) {
      toast({
        title: "Error saving appointment",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-red-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/add-task")}
              className="hover:bg-red-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">Doctor Appointment</h1>
              <p className="text-sm text-gray-600">Schedule your medical appointment</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 border-red-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-red-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name *</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                  placeholder="Dr. Sarah Johnson"
                  className="border-red-200 focus:border-red-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Select 
                  value={formData.specialty} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}
                >
                  <SelectTrigger className="border-red-200 focus:border-red-400">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Appointment Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-red-200 focus:border-red-400",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="pl-10 border-red-200 focus:border-red-400"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Appointment Type */}
          <Card className="p-6 border-red-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Type of Appointment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {appointmentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.appointmentTypes.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                    className="border-red-300 data-[state=checked]:bg-red-600"
                  />
                  <Label htmlFor={type} className="text-sm cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
            
            {formData.appointmentTypes.includes('Other') && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="otherType">Specify Other Type</Label>
                <Input
                  id="otherType"
                  value={formData.otherType}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherType: e.target.value }))}
                  placeholder="Describe the appointment type"
                  className="border-red-200 focus:border-red-400"
                />
              </div>
            )}
          </Card>

          {/* Additional Details */}
          <Card className="p-6 border-red-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Details
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location/Clinic</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City Medical Center"
                  className="border-red-200 focus:border-red-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Contact Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="border-red-200 focus:border-red-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any specific concerns, questions, or preparations needed for this appointment..."
                  className="border-red-200 focus:border-red-400 min-h-[100px]"
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/add-task")}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}