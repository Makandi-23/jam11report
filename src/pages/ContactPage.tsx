import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface ContactFormData {
  name: string;
  ward: string;
  phone: string;
  email: string;
  message: string;
}

const wardContacts = {
  'laini saba': {
    name: 'Grace Mwangi',
    phone: '+254 712 345 678',
    email: 'lainisaba@kibra.go.ke',
    hours: '8:00 AM – 5:00 PM'
  },
  makina: {
    name: 'Hassan Omar',
    phone: '+254 723 456 789',
    email: 'makina@kibra.go.ke',
    hours: '8:00 AM – 5:00 PM'
  },
  lindi: {
    name: 'Jane Kamau',
    phone: '+254 734 567 890',
    email: 'lindi@kibra.go.ke',
    hours: '8:00 AM – 5:00 PM'
  },
  "sarang'ombe": {
    name: 'Peter Ochieng',
    phone: '+254 745 678 901',
    email: 'sarangombe@kibra.go.ke',
    hours: '8:00 AM – 5:00 PM'
  },
  'woodley/kenyatta golf course': {
    name: 'Fatuma Ali',
    phone: '+254 756 789 012',
    email: 'woodley@kibra.go.ke',
    hours: '8:00 AM – 5:00 PM'
  }
};

const emergencyContacts = [
  {
    name_en: 'Police Emergency',
    name_sw: 'Dharura ya Polisi',
    phone: '999',
    available: '24/7'
  },
  {
    name_en: 'Fire Department',
    name_sw: 'Idara ya Moto',
    phone: '997',
    available: '24/7'
  },
  {
    name_en: 'Ambulance',
    name_sw: 'Gari la Wagonjwa',
    phone: '998',
    available: '24/7'
  },
  {
    name_en: 'County Health Services',
    name_sw: 'Huduma za Afya za Kaunti',
    phone: '+254 700 123 456',
    available: 'Mon-Sun: 8AM-8PM'
  }
];

const faqs = [
  {
    question_en: 'How can I track my report?',
    question_sw: 'Ninawezaje kufuatilia ripoti yangu?',
    answer_en: 'Once you submit a report, you can track its status from your Dashboard under "My Reports". You\'ll receive updates when the status changes.',
    answer_sw: 'Ukisha wasilisha ripoti, unaweza kufuatilia hali yake kutoka kwa Dashibodi yako chini ya "Ripoti Zangu". Utapokea masasisho wakati hali inabadilika.'
  },
  {
    question_en: 'How are issues prioritized?',
    question_sw: 'Masuala yanawekwaje kipaumbele?',
    answer_en: 'Issues are prioritized based on urgency, community votes, and impact. Emergency issues like security threats are handled immediately.',
    answer_sw: 'Masuala yanawekwa kipaumbele kulingana na dharura, kura za jamii, na athari. Masuala ya dharura kama vitisho vya usalama vinashughulikiwa mara moja.'
  },
  {
    question_en: 'Can I visit the ward office in person?',
    question_sw: 'Je, naweza kutembelea ofisi ya kata mimi mwenyewe?',
    answer_en: 'Yes, our offices are open Monday to Friday, 8AM-5PM. We recommend calling ahead to schedule an appointment.',
    answer_sw: 'Ndiyo, ofisi zetu zinafunguliwa Jumatatu hadi Ijumaa, 8AM-5PM. Tunapendekeza kupiga simu kabla ya kuja kuweka miadi.'
  }
];

export default function ContactPage() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const [formData, setFormData] = useState<ContactFormData>({
    name: user?.user_metadata?.full_name || '',
    ward: user?.user_metadata?.ward || 'Lindi',
    phone: '',
    email: user?.email || '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.ward || !formData.phone || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        ...formData,
        phone: '',
        message: ''
      });

      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const wardKey = formData.ward.toLowerCase().replace(/\s+/g, '') as keyof typeof wardContacts;
  const wardContact = wardContacts[wardKey];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'en' ? 'Contact JamiiReport Support' : 'Wasiliana na Msaada wa JamiiReport'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'en' ? 'Reach your ward office or send us a message directly' : 'Wasiliana na ofisi ya kata yako au tutumie ujumbe moja kwa moja'}
            </p>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Send us a message' : 'Tutumie ujumbe'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Your Name' : 'Jina Lako'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={!!user?.user_metadata?.full_name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Your Ward' : 'Kata Yako'}
                  </label>
                  <select
                    required
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    disabled={!!user?.user_metadata?.ward}
                  >
                    <option value="Lindi">Lindi</option>
                    <option value="Makina">Makina</option>
                    <option value="Woodley/Kenyatta Golf Course">Woodley/Kenyatta Golf Course</option>
                    <option value="Sarang'ombe">Sarang'ombe</option>
                    <option value="Laini Saba">Laini Saba</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone Number' : 'Nambari ya Simu'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Email Address' : 'Barua Pepe'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={!!user?.email}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Your Message' : 'Ujumbe Wako'}
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={language === 'en' ? 'How can we help you?' : 'Tunawezaje kukusaidia?'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl border border-green-200"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">
                    {language === 'en' ? '✅ Your message has been sent!' : '✅ Ujumbe wako umetumwa!'}
                  </span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">
                    {language === 'en' ? '⚠️ Please fill in all fields.' : '⚠️ Tafadhali jaza sehemu zote.'}
                  </span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {language === 'en' ? 'Sending...' : 'Inatuma...'}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    {language === 'en' ? 'Send Message' : 'Tuma Ujumbe'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          {wardContact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Your Ward Office' : 'Ofisi ya Kata Yako'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{wardContact.name}</p>
                    <p className="text-sm text-gray-600">{formData.ward} {language === 'en' ? 'Ward' : 'Kata'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">{language === 'en' ? 'Tel' : 'Simu'}</p>
                    <a href={`tel:${wardContact.phone}`} className="text-gray-900 hover:text-teal-600 transition-colors">{wardContact.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900">{wardContact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">{language === 'en' ? 'Hours' : 'Masaa'}</p>
                    <p className="text-gray-900">{wardContact.hours}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-red-100 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Emergency Contacts' : 'Nambari za Dharura'}
            </h2>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {language === 'en' ? contact.name_en : contact.name_sw}
                    </p>
                    <p className="text-xs text-gray-600">{contact.available}</p>
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    {contact.phone}
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === 'en' ? 'Frequently Asked Questions' : 'Maswali Yanayoulizwa Mara kwa Mara'}
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <motion.button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    whileHover={{ scale: 1.01 }}
                  >
                    <span className="font-medium text-gray-900 text-sm">
                      {language === 'en' ? faq.question_en : faq.question_sw}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </motion.button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3"
                    >
                      {language === 'en' ? faq.answer_en : faq.answer_sw}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
        </div>
      </main>

      <Footer variant="dashboard" />
    </div>
  );
}
