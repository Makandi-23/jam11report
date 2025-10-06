import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  ChevronLeft, ChevronRight, Upload, X, MapPin,
  Mic, CheckCircle, Users, ArrowRight, AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';

interface FormData {
  category: string;
  title: string;
  description: string;
  ward: string;
  estate: string;
  photos: File[];
}

const schema = yup.object({
  category: yup.string().required('Please select a category'),
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  ward: yup.string().required('Please select your ward'),
  estate: yup.string(),
});

const ReportNewPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      category: '',
      title: '',
      description: '',
      ward: user?.ward || '',
      estate: '',
      photos: []
    }
  });

  const categories = [
    {
      id: 'security',
      name: 'Security',
      icon: '🛡️',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      borderColor: 'border-red-500',
      examples: 'Street fights, theft, vandalism, unsafe areas'
    },
    {
      id: 'environment',
      name: 'Environment',
      icon: '🌿',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      borderColor: 'border-green-500',
      examples: 'Garbage, pollution, drainage, cleanliness'
    },
    {
      id: 'health',
      name: 'Health',
      icon: '➕',
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600',
      borderColor: 'border-emerald-500',
      examples: 'Water issues, sanitation, medical emergencies'
    },
    {
      id: 'other',
      name: 'Other',
      icon: 'ℹ️',
      color: 'bg-slate-500',
      hoverColor: 'hover:bg-slate-600',
      borderColor: 'border-slate-500',
      examples: 'Infrastructure, utilities, community issues'
    }
  ];

  const wards = [
    'Lindi',
    'Laini Saba',
    'Makina',
    'Woodley/Kenyatta Golf Course',
    "Sarang'ombe"
  ];

  const steps = [
    { number: 1, title: 'Category', description: 'What type of issue?' },
    { number: 2, title: 'Details', description: 'Tell us more' },
    { number: 3, title: 'Location', description: 'Where is it?' },
    { number: 4, title: 'Photos', description: 'Add evidence' },
    { number: 5, title: 'Review', description: 'Confirm details' }
  ];

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });
    
    setUploadedPhotos(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError('');

    if (!data.category || !data.title || !data.description || !data.ward) {
      setSubmitError('⚠️ Please complete all required fields before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmitError('⚠️ Failed to submit report. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = watch('category');
  const title = watch('title');
  const description = watch('description');

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-pale">
        <Header />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto px-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ✅ Your issue has been successfully submitted!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Thank you for helping improve your community!
              </p>
              <p className="text-gray-500 mb-8">
                Your report has been submitted and will be reviewed by the team.
                You'll be notified of any updates.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setCurrentStep(1);
                  setUploadedPhotos([]);
                }}
                className="px-6 py-3 border-2 border-deepTeal text-deepTeal rounded-xl hover:bg-deepTeal hover:text-white transition font-medium"
              >
                Report Another Issue
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-deepTeal text-white rounded-xl hover:bg-deepTeal/90 transition font-medium"
              >
                Go to Dashboard
              </button>
            </motion.div>

            {/* Community Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-8xl opacity-20"
            >
              <Users className="w-32 h-32 mx-auto text-deepTeal" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-md mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    currentStep === step.number ? 'text-deepTeal' : 
                    currentStep > step.number ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      currentStep === step.number ? 'bg-deepTeal text-white' : 
                      currentStep > step.number ? 'bg-green-600 text-white' : 'bg-gray-200'
                    }`}>
                      {currentStep > step.number ? <CheckCircle className="w-4 h-4" /> : step.number}
                    </div>
                    <div className="hidden sm:block">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-deepTeal h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* Error Message */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-800 font-medium">{submitError}</p>
            </motion.div>
          )}

          {/* Form Steps */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1: Category Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-xl p-8 shadow-md"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of issue are you reporting?</h2>
                  <p className="text-gray-600 mb-8">Select the category that best describes your issue</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCategory === category.id
                            ? `${category.borderColor} bg-gray-50 ring-2 ring-deepTeal ring-opacity-20`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setValue('category', category.id)}
                      >
                        <input
                          type="radio"
                          value={category.id}
                          {...register('category')}
                          className="sr-only"
                        />
                        
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}>
                            {category.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                        </div>
                        
                        <p className="text-gray-600 text-sm">{category.examples}</p>
                        
                        {selectedCategory === category.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-6 h-6 bg-deepTeal rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {errors.category && (
                    <p className="mt-4 text-red-600 text-sm">{errors.category.message}</p>
                  )}
                </motion.div>
              )}

              {/* Step 2: Title & Description */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-xl p-8 shadow-md"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about the issue</h2>
                  <p className="text-gray-600 mb-8">Be clear and concise so others understand quickly</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        {...register('title')}
                        placeholder="Summarize the issue in one sentence"
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-deepTeal focus:border-transparent transition ${
                          errors.title ? 'border-red-300' : 'border-gray-200'
                        }`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-red-600 text-sm">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <div className="relative">
                        <textarea
                          {...register('description')}
                          rows={6}
                          placeholder="Provide more details about the issue, when it happens, and how it affects the community..."
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-deepTeal focus:border-transparent transition resize-none ${
                            errors.description ? 'border-red-300' : 'border-gray-200'
                          }`}
                        />
                        <button
                          type="button"
                          className="absolute bottom-3 right-3 p-2 text-gray-400 hover:text-deepTeal transition"
                          title="Voice input (coming soon)"
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        {errors.description && (
                          <p className="text-red-600 text-sm">{errors.description.message}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                          {description?.length || 0} characters
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-xl p-8 shadow-md"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Where is this issue located?</h2>
                  <p className="text-gray-600 mb-8">Help us pinpoint the exact location</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ward *
                      </label>
                      <select
                        {...register('ward')}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-deepTeal focus:border-transparent transition ${
                          errors.ward ? 'border-red-300' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select your ward</option>
                        {wards.map(ward => (
                          <option key={ward} value={ward}>{ward}</option>
                        ))}
                      </select>
                      {errors.ward && (
                        <p className="mt-1 text-red-600 text-sm">{errors.ward.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estate/Street (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('estate')}
                        placeholder="Enter specific location details"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent transition"
                      />
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Step 4: Photo Upload */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-xl p-8 shadow-md"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Add photos (Optional)</h2>
                  <p className="text-gray-600 mb-8">Photos help others understand the issue better</p>
                  
                  <div className="space-y-6">
                    {/* Upload Zone */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-deepTeal transition">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <label htmlFor="photo-upload" className="text-deepTeal hover:text-deepTeal/80 cursor-pointer font-medium">
                            Click to upload
                          </label>
                          {' '}or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB each (max 5 photos)</p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Photo Previews */}
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-xl p-8 shadow-md"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Review your report</h2>
                  <p className="text-gray-600 mb-8">Please review all details before submitting</p>
                  
                  <div className="space-y-6">
                    {/* Category */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Category</h3>
                      <div className="flex items-center">
                        {categories.find(cat => cat.id === selectedCategory) && (
                          <>
                            <span className="text-2xl mr-3">
                              {categories.find(cat => cat.id === selectedCategory)?.icon}
                            </span>
                            <span className="font-medium">
                              {categories.find(cat => cat.id === selectedCategory)?.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Issue Details</h3>
                      <h4 className="font-semibold text-lg mb-2">{title}</h4>
                      <p className="text-gray-700">{description}</p>
                    </div>

                    {/* Location */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                        <span>{getValues('ward')}</span>
                        {getValues('estate') && (
                          <span className="text-gray-600 ml-2">• {getValues('estate')}</span>
                        )}
                      </div>
                    </div>

                    {/* Photos */}
                    {uploadedPhotos.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Photos ({uploadedPhotos.length})</h3>
                        <div className="grid grid-cols-4 gap-2">
                          {uploadedPhotos.map((photo, index) => (
                            <img
                              key={index}
                              src={URL.createObjectURL(photo)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !selectedCategory) ||
                    (currentStep === 2 && (!title || !description)) ||
                    (currentStep === 3 && !getValues('ward'))
                  }
                  className="flex items-center px-6 py-3 bg-deepTeal text-white rounded-xl hover:bg-deepTeal/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-deepTeal text-white rounded-xl hover:bg-deepTeal/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Report
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ReportNewPage;