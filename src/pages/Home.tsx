import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Users, DollarSign, Award, CheckCircle, Home as HomeIcon, Building2, Battery, Settings, ChevronDown, Mail, Phone, MapPin, Clock, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import heroImage from '@/assets/hero-solar.jpg';
import solarFarm from '@/assets/solar-farm.jpg';
import residentialSolar from '@/assets/residential-solar.jpg';
import commercialSolar from '@/assets/commercial-solar.jpg';
import batteryStorage from '@/assets/battery-storage.jpg';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Product from './Product';

interface Product {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  price_cents: number;
  image_url: string;
}

const Home = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent!',
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/30 to-accent/35"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background mb-6 leading-tight">
              Powering a Cleaner Future with Cworth Energy
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-background/95 mb-8 lg:mb-12 leading-relaxed">
              Affordable and reliable solar solutions for homes and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/2349017813274"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="xl" className="gap-2">
                  <MessageCircle size={22} />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link to="/services">
                <Button variant="heroOutline" size="xl">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Solar Energy?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who made the switch to clean, affordable energy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Reliable Solar Systems</h3>
              <p className="text-muted-foreground">
                Long-lasting and efficient panels designed to power your home for decades.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Expert Installation</h3>
              <p className="text-muted-foreground">
                Professional engineers and certified technicians handle every installation.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Affordable Energy</h3>
              <p className="text-muted-foreground">
                Save up to 60% on electricity bills while protecting the environment.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              About Cworth Energy
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
              We are Nigeria's premier solar energy provider, delivering world-class solar systems that set the standard for quality and reliability. At Cworth Energy, we specialize in top-notch solar installations using only the best components available in the market.
            </p>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
              Our commitment to excellence has made us the trusted choice for homes and businesses across Nigeria. We offer premium-grade solar panels, cutting-edge inverter technology, and professional installation services that guarantee maximum performance and longevity.
            </p>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              When you choose Cworth Energy, you're choosing the best solar solutions in Nigeria - top quality products, expert installation, unmatched reliability, and exceptional after-sales support. Experience the difference that premium solar technology can make for your energy needs.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl lg:text-5xl font-bold mb-2">1,000+</div>
              <div className="text-lg lg:text-xl text-primary-foreground/90">Panels Installed</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl lg:text-5xl font-bold mb-2">1,000</div>
              <div className="text-lg lg:text-xl text-primary-foreground/90">Tons of CO₂ Saved</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl lg:text-5xl font-bold mb-2">1,000+</div>
              <div className="text-lg lg:text-xl text-primary-foreground/90">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 animate-fade-in">
              <img
                src={solarFarm}
                alt="Solar farm with panels in green field"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Why Choose Cworth Energy?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Government-certified solar provider</h3>
                    <p className="text-muted-foreground">
                      Fully licensed and certified to deliver top-quality installations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Cutting-edge technology</h3>
                    <p className="text-muted-foreground">
                      Using the latest solar panel and battery technology for maximum efficiency
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">24/7 customer support</h3>
                    <p className="text-muted-foreground">
                      Round-the-clock monitoring and support for all your solar needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Transparent pricing</h3>
                    <p className="text-muted-foreground">
                      No hidden fees, just honest quotes and competitive rates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solar Solutions Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Solar Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solar energy services tailored to your needs
            </p>
          </div>

          <div className="space-y-16">
            {/* Residential Solar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src={residentialSolar}
                  alt="Modern home with solar panels"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="order-1 lg:order-2 animate-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <HomeIcon className="text-primary" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Residential Solar Installation
                </h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Custom solar systems designed for your home to maximize energy production and minimize electricity costs.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Free home energy assessment</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Premium quality solar panels with 25-year warranty</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Professional installation by certified technicians</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Commercial Solar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Building2 className="text-primary" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Commercial Solar Solutions
                </h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Power your business with scalable solar systems that reduce operational costs and demonstrate your commitment to sustainability.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Custom commercial energy solutions</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Scalable systems for businesses of all sizes</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Minimal disruption to operations</span>
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src={commercialSolar}
                  alt="Commercial building with solar installation"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>

            {/* Battery Storage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img
                  src={batteryStorage}
                  alt="Solar battery storage system"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
              <div className="order-1 lg:order-2 animate-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Battery className="text-primary" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Battery Storage Systems
                </h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  Store excess solar power for nighttime use and emergencies. Never worry about power outages again.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Store energy for use anytime, day or night</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Backup power during outages</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronDown className="text-primary mr-2 flex-shrink-0 mt-1 rotate-[-90deg]" size={20} />
                    <span className="text-muted-foreground">Smart energy management technology</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Maintenance and Monitoring */}
            <Card className="p-8 lg:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <div className="max-w-4xl mx-auto text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="text-primary" size={32} />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  Maintenance and Monitoring
                </h3>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  24/7 real-time monitoring and comprehensive maintenance services ensure your solar system operates at peak efficiency.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Real-time Monitoring</h4>
                    <p className="text-muted-foreground">Track your energy production through our mobile app</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Preventive Maintenance</h4>
                    <p className="text-muted-foreground">Regular inspections to maximize performance</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Fast Repairs</h4>
                    <p className="text-muted-foreground">Quick response times for any issues</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Performance Guarantee</h4>
                    <p className="text-muted-foreground">We ensure expected energy production</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people who made the switch to solar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Award className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Homeowner</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Cworth Energy transformed our home's energy use and saved us thousands. The installation was seamless and professional."
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Award className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Michael Chen</h4>
                  <p className="text-sm text-muted-foreground">Business Owner</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Our company's electricity costs dropped by 55% after switching to solar. Best investment we've made for our business."
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <Award className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Emily Rodriguez</h4>
                  <p className="text-sm text-muted-foreground">Property Manager</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The team was incredibly knowledgeable and supportive. They made going solar easy and stress-free for all our properties."
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Product />

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Let's Build a Sustainable Future Together
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to make the switch to solar? Get in touch with our team for a free consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <Card className="p-8 lg:p-10 border-2 shadow-xl">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 XXX XXX XXXX"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your solar energy needs..."
                      rows={6}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 animate-slide-up">
              <Card className="p-6 border-2 hover:border-primary transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground">+234 901 781 3274</p>
                    <p className="text-sm text-muted-foreground mt-1">Mon-Fri: 8AM - 6PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground">info@cworthenergy.com</p>
                    <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Office Location</h4>
                    <p className="text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Business Hours</h4>
                    <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-muted-foreground">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join the Solar Revolution Today
            </h2>
            <p className="text-lg lg:text-xl mb-8 text-primary-foreground/95">
              Start saving money while protecting the planet. Get your free consultation now.
            </p>
            <a
              href="https://wa.me/2349017813274"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="heroOutline" size="xl">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
      

      <Footer />
    </div>
  );
};

export default Home;
