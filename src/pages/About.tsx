import { Card } from '@/components/ui/card';
import { Leaf, Lightbulb, Shield, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Header Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Our Mission at Cworth Solar Energy
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Delivering affordable, sustainable solar solutions for a cleaner future.
            </p>
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Sustainability</h3>
              <p className="text-muted-foreground">
                Committed to protecting our environment through clean energy solutions
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Innovation</h3>
              <p className="text-muted-foreground">
                Using cutting-edge technology to provide the most efficient solar systems
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Integrity</h3>
              <p className="text-muted-foreground">
                Transparent pricing and honest communication in every interaction
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Customer Satisfaction</h3>
              <p className="text-muted-foreground">
                Your happiness and energy independence are our top priorities
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
