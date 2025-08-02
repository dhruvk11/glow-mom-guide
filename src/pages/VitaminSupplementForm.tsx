import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Pill, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const predefinedVitamins = [
  { name: "Folic Acid", defaultDosage: "400", unit: "mcg", category: "Essential" },
  { name: "Prenatal Multivitamin", defaultDosage: "1", unit: "capsule", category: "Essential" },
  { name: "Iron Supplement", defaultDosage: "27", unit: "mg", category: "Essential" },
  { name: "Calcium", defaultDosage: "1000", unit: "mg", category: "Important" },
  { name: "Vitamin D", defaultDosage: "1000", unit: "IU", category: "Important" },
  { name: "DHA / Omega-3", defaultDosage: "200", unit: "mg", category: "Important" },
  { name: "Magnesium", defaultDosage: "350", unit: "mg", category: "Beneficial" },
  { name: "Probiotic", defaultDosage: "1", unit: "capsule", category: "Beneficial" },
  { name: "Vitamin B12", defaultDosage: "2.6", unit: "mcg", category: "Beneficial" },
  { name: "Zinc", defaultDosage: "11", unit: "mg", category: "Beneficial" }
];

const timingOptions = [
  "Morning (6-10 AM)",
  "Afternoon (12-4 PM)",
  "Evening (6-8 PM)",
  "Night (8-10 PM)",
  "With breakfast",
  "With lunch", 
  "With dinner",
  "Before bed",
  "Custom time"
];

const dosageUnits = ["mg", "mcg", "IU", "ml", "capsule", "tablet", "drops", "gummies"];

interface VitaminEntry {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  timing: string;
  customTime?: string;
  frequency: string;
  withFood: boolean;
  category: string;
}

export default function VitaminSupplementForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedVitamins, setSelectedVitamins] = useState<VitaminEntry[]>([]);
  const [customVitamins, setCustomVitamins] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPredefinedVitamin = (vitamin: typeof predefinedVitamins[0]) => {
    const newVitamin: VitaminEntry = {
      id: Date.now().toString(),
      name: vitamin.name,
      dosage: vitamin.defaultDosage,
      unit: vitamin.unit,
      timing: "Morning (6-10 AM)",
      frequency: "Daily",
      withFood: vitamin.name.includes("Iron") ? false : true,
      category: vitamin.category
    };
    
    setSelectedVitamins(prev => [...prev, newVitamin]);
  };

  const removePredefinedVitamin = (vitaminName: string) => {
    setSelectedVitamins(prev => prev.filter(v => v.name !== vitaminName));
  };

  const updateVitamin = (id: string, updates: Partial<VitaminEntry>) => {
    setSelectedVitamins(prev => prev.map(v => 
      v.id === id ? { ...v, ...updates } : v
    ));
  };

  const addCustomVitamin = () => {
    setCustomVitamins(prev => [...prev, ""]);
  };

  const updateCustomVitamin = (index: number, value: string) => {
    setCustomVitamins(prev => prev.map((v, i) => i === index ? value : v));
  };

  const removeCustomVitamin = (index: number) => {
    setCustomVitamins(prev => prev.filter((_, i) => i !== index));
  };

  const isVitaminSelected = (vitaminName: string) => {
    return selectedVitamins.some(v => v.name === vitaminName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedVitamins.length === 0) {
      toast({
        title: "No vitamins selected",
        description: "Please select at least one vitamin or supplement",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create tasks for each vitamin
      const tasks = selectedVitamins.map(vitamin => ({
        id: `vitamin-${Date.now()}-${vitamin.id}`,
        type: 'vitamin-supplement' as const,
        title: `${vitamin.name} - ${vitamin.dosage}${vitamin.unit}`,
        status: 'pending' as const,
        data: {
          ...vitamin,
          notes,
          customVitamins: customVitamins.filter(v => v.trim())
        },
        createdAt: new Date().toISOString()
      }));

      // Save to localStorage
      const existingTasks = JSON.parse(localStorage.getItem('wellness-tasks') || '[]');
      existingTasks.push(...tasks);
      localStorage.setItem('wellness-tasks', JSON.stringify(existingTasks));

      toast({
        title: "Vitamins added! 💊",
        description: `${selectedVitamins.length} vitamin${selectedVitamins.length > 1 ? 's' : ''} added to your daily routine`,
        duration: 5000,
      });

      navigate('/my-tasks');
    } catch (error) {
      toast({
        title: "Error saving vitamins",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedVitamins = predefinedVitamins.reduce((acc, vitamin) => {
    if (!acc[vitamin.category]) acc[vitamin.category] = [];
    acc[vitamin.category].push(vitamin);
    return acc;
  }, {} as Record<string, typeof predefinedVitamins>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-green-200/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/add-task")}
              className="hover:bg-green-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold text-gray-800">Vitamin & Supplements</h1>
              <p className="text-sm text-gray-600">Track your daily vitamins</p>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vitamin Selection */}
          {Object.entries(groupedVitamins).map(([category, vitamins]) => (
            <Card key={category} className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                {category} Vitamins
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vitamins.map((vitamin) => (
                  <div
                    key={vitamin.name}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${isVitaminSelected(vitamin.name)
                        ? 'border-green-500 bg-green-50'
                        : 'border-green-200 hover:border-green-300 bg-white'
                      }
                    `}
                    onClick={() => {
                      if (isVitaminSelected(vitamin.name)) {
                        removePredefinedVitamin(vitamin.name);
                      } else {
                        addPredefinedVitamin(vitamin);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {vitamin.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {vitamin.defaultDosage} {vitamin.unit}
                        </div>
                      </div>
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isVitaminSelected(vitamin.name)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                        }
                      `}>
                        {isVitaminSelected(vitamin.name) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Selected Vitamins Configuration */}
          {selectedVitamins.length > 0 && (
            <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Configure Your Vitamins
              </h2>
              
              <div className="space-y-4">
                {selectedVitamins.map((vitamin) => (
                  <div key={vitamin.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">{vitamin.name}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePredefinedVitamin(vitamin.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <div className="flex gap-2">
                          <Input
                            value={vitamin.dosage}
                            onChange={(e) => updateVitamin(vitamin.id, { dosage: e.target.value })}
                            className="flex-1 border-green-200"
                          />
                          <Select
                            value={vitamin.unit}
                            onValueChange={(value) => updateVitamin(vitamin.id, { unit: value })}
                          >
                            <SelectTrigger className="w-20 border-green-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dosageUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Timing</Label>
                        <Select
                          value={vitamin.timing}
                          onValueChange={(value) => updateVitamin(vitamin.id, { timing: value })}
                        >
                          <SelectTrigger className="border-green-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timingOptions.map((timing) => (
                              <SelectItem key={timing} value={timing}>
                                {timing}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={vitamin.frequency}
                          onValueChange={(value) => updateVitamin(vitamin.id, { frequency: value })}
                        >
                          <SelectTrigger className="border-green-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Every other day">Every other day</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="As needed">As needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-2">
                      <Checkbox
                        id={`withFood-${vitamin.id}`}
                        checked={vitamin.withFood}
                        onCheckedChange={(checked) => updateVitamin(vitamin.id, { withFood: !!checked })}
                        className="border-green-300 data-[state=checked]:bg-green-600"
                      />
                      <Label htmlFor={`withFood-${vitamin.id}`} className="text-sm">
                        Take with food
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Custom Vitamins */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Additional Vitamins/Medications
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addCustomVitamin}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {customVitamins.map((vitamin, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={vitamin}
                    onChange={(e) => updateCustomVitamin(index, e.target.value)}
                    placeholder="e.g., Vitamin C 500mg daily"
                    className="flex-1 border-green-200 focus:border-green-400"
                  />
                  {customVitamins.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomVitamin(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Notes & Side Effects
            </h2>
            
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any side effects, doctor's instructions, or reminders about your vitamins..."
              className="border-green-200 focus:border-green-400 min-h-[100px]"
            />
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/add-task")}
              className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? "Saving..." : "Add to Daily Routine"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}