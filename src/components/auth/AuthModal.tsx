import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Heart } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dueDate: '',
    acceptTerms: false,
    notifications: {
      mood: true,
      sleep: true,
      tasks: true,
      weekly: true,
    },
    language: 'English',
  });

  const { signUp, signIn, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      
      toast({
        title: "Welcome back! 💕",
        description: "You've successfully signed in to your wellness journey.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) throw error;
      
      toast({
        title: "Welcome to your wellness journey! 🌸",
        description: "Please check your email to verify your account.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(formData.email);
      if (error) throw error;
      
      toast({
        title: "Reset email sent 📧",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Personal Information";
      case 2: return "Pregnancy Details";
      case 3: return "Notification Preferences";
      case 4: return "Almost Done!";
      default: return "Welcome";
    }
  };

  const progressValue = mode === 'register' ? (step / 4) * 100 : 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-primary">
            {mode === 'login' ? 'Welcome Back' : getStepTitle()}
          </DialogTitle>
          {mode === 'register' && (
            <div className="mt-4">
              <Progress value={progressValue} className="h-2" />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Step {step} of 4
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {mode === 'login' ? (
            // Login Form
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full" 
                disabled={loading || !formData.email || !formData.password}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  variant="link"
                  onClick={handleForgotPassword}
                  className="text-sm text-muted-foreground"
                >
                  Forgot your password?
                </Button>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    onClick={() => onModeChange('register')}
                    className="p-0 h-auto font-medium text-primary"
                  >
                    Create one
                  </Button>
                </p>
              </div>
            </div>
          ) : (
            // Registration Form
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Create Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Create a secure password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters long
                    </p>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  <div className="p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      We'll use this to calculate your current week and provide personalized content
                    </p>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Choose which notifications you'd like to receive:
                    </p>
                    
                    {[
                      { key: 'mood', label: 'Mood Reminders', desc: 'Daily check-ins at 8 PM' },
                      { key: 'sleep', label: 'Sleep Tracking', desc: 'Gentle bedtime reminders' },
                      { key: 'tasks', label: 'Wellness Tasks', desc: 'Daily wellness activities' },
                      { key: 'weekly', label: 'Weekly Summary', desc: 'Progress insights via email' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start space-x-3">
                        <Checkbox
                          id={key}
                          checked={formData.notifications[key as keyof typeof formData.notifications]}
                          onCheckedChange={(checked) =>
                            setFormData(prev => ({
                              ...prev,
                              notifications: { ...prev.notifications, [key]: checked }
                            }))
                          }
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={key} className="text-sm font-medium">
                            {label}
                          </Label>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="text-center space-y-4">
                    <div className="p-6 bg-gradient-wellness rounded-lg">
                      <Heart className="w-8 h-8 text-white mx-auto mb-2" />
                      <h3 className="font-semibold text-white mb-2">Welcome to Your Journey!</h3>
                      <p className="text-sm text-white/90">
                        You're all set to start tracking your wellness during pregnancy
                      </p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) =>
                          setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
                        }
                      />
                      <div className="space-y-1">
                        <Label htmlFor="terms" className="text-sm">
                          I accept the Terms of Service and Privacy Policy
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Your data is encrypted and never shared without consent
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleRegister}
                  disabled={loading || (step === 4 && !formData.acceptTerms)}
                  className="flex-1"
                >
                  {loading ? "Creating..." : step === 4 ? "Create Account" : "Continue"}
                </Button>
              </div>

              {step === 1 && (
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    onClick={() => onModeChange('login')}
                    className="p-0 h-auto font-medium text-primary"
                  >
                    Sign in
                  </Button>
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}