import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, MapPin, Upload, 
  Check, ChevronLeft, ChevronRight, Eye, EyeOff,
  Shield, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import LanguageToggle from '../components/layout/LanguageToggle';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  ward: string;
  estate: string;
  proofFile: File | null;
}

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    ward: '',
    estate: '',
    proofFile: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const wards = [
    'Lindi',
    'Laini Saba',
    'Makina',
    'Woodley/Kenyatta Golf Course',
    "Sarang'ombe"
  ];

  const steps = [
    { number: 1, title: 'Account', icon: User },
    { number: 2, title: 'Contact', icon: Phone },
    { number: 3, title: 'Proof', icon: Upload },
    { number: 4, title: 'Review', icon: Check },
  ];

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-600' };
      case 2: return { text: 'Weak', color: 'text-orange-600' };
      case 3: return { text: 'Fair', color: 'text-yellow-600' };
      case 4: return { text: 'Good', color: 'text-blue-600' };
      case 5: return { text: 'Strong', color: 'text-green-600' };
      default: return { text: '', color: '' };
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
      case 2:
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.ward) newErrors.ward = 'Ward selection is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        ward: formData.ward,
        estate: formData.estate,
        role: 'resident'
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, proofFile: file }));
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="min-h-screen bg-pale">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-deepTeal to-primary p-6 text-white">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-bold">
                Jamii<span className="text-white/90">report</span>
              </span>
            </Link>
            
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-white/90">Join your community in making a difference</p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${
                      isActive ? 'text-deepTeal' : isCompleted ? 'text-success-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-deepTeal text-white' : 
                        isCompleted ? 'bg-success-600 text-white' : 'bg-gray-200'
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                        isCompleted ? 'bg-success-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Account Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`input-field pl-10 ${errors.name ? 'border-red-300' : ''}`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className={`input-field pl-10 ${errors.email ? 'border-red-300' : ''}`}
                            placeholder="Enter your email"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-300' : ''}`}
                            placeholder="Create a password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    passwordStrength <= 2 ? 'bg-red-500' :
                                    passwordStrength <= 3 ? 'bg-yellow-500' :
                                    passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium ${passwordStrengthInfo.color}`}>
                                {passwordStrengthInfo.text}
                              </span>
                            </div>
                          </div>
                        )}
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <p className="mt-1 text-sm text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Passwords match
                          </p>
                        )}
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className={`input-field pl-10 ${errors.phone ? 'border-red-300' : ''}`}
                            placeholder="0712345678"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ward
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <select
                            value={formData.ward}
                            onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                            className={`input-field pl-10 ${errors.ward ? 'border-red-300' : ''}`}
                          >
                            <option value="">Select your ward</option>
                            {wards.map(ward => (
                              <option key={ward} value={ward}>{ward}</option>
                            ))}
                          </select>
                        </div>
                        {errors.ward && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.ward}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estate/Street (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.estate}
                          onChange={(e) => setFormData(prev => ({ ...prev, estate: e.target.value }))}
                          className="input-field"
                          placeholder="Enter your estate or street name"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Proof of Residence */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Proof of Residence (Optional)</h2>
                    <p className="text-gray-600 mb-6">
                      Upload a document that proves your residence (ID, utility bill, etc.). This helps us verify your location and build trust in the community.
                    </p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <label htmlFor="proof-upload" className="text-deepTeal hover:text-deepTeal/80 cursor-pointer font-medium">
                            Click to upload
                          </label>
                          {' '}or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, PDF up to 5MB</p>
                      </div>
                      <input
                        id="proof-upload"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {formData.proofFile && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              {formData.proofFile.name}
                            </span>
                          </div>
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, proofFile: null }))}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h2>
                    <p className="text-gray-600 mb-6">
                      Please review your information before submitting your registration.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Name:</span> {formData.name}</p>
                          <p><span className="font-medium">Email:</span> {formData.email}</p>
                        </div>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-deepTeal hover:text-deepTeal/80 text-sm mt-2"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Contact Details</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                          <p><span className="font-medium">Ward:</span> {formData.ward}</p>
                          {formData.estate && (
                            <p><span className="font-medium">Estate:</span> {formData.estate}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-deepTeal hover:text-deepTeal/80 text-sm mt-2"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-2">Proof of Residence</h3>
                        <div className="text-sm text-gray-600">
                          {formData.proofFile ? (
                            <p><span className="font-medium">File:</span> {formData.proofFile.name}</p>
                          ) : (
                            <p>No file uploaded</p>
                          )}
                        </div>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="text-deepTeal hover:text-deepTeal/80 text-sm mt-2"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors.submit}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 btn-primary"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-deepTeal hover:text-deepTeal/80 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;