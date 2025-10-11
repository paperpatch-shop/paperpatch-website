import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Images, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-warm opacity-80" />
      </div>

      {/* Two Section Layout */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="container grid md:grid-cols-2 gap-6 md:gap-8 max-w-7xl">
          
          {/* Gallery Section */}
          <Link to="/gallery" className="group">
            <div className="relative h-[400px] md:h-[600px] bg-card/80 backdrop-blur-sm rounded-2xl shadow-paper hover:shadow-medium transition-all duration-500 overflow-hidden border-2 border-border/50 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Images className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
                  Gallery
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                  Explore our collection of custom posters and read what our customers have to say
                </p>
              </div>
            </div>
          </Link>

          {/* Start Creating Section */}
          <Link to="/create" className="group">
            <div className="relative h-[400px] md:h-[600px] bg-primary/90 backdrop-blur-sm rounded-2xl shadow-paper hover:shadow-medium transition-all duration-500 overflow-hidden border-2 border-primary/50 hover:border-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                  Start Creating
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-md">
                  Turn your memories into beautiful custom posters. Upload, design, and order in minutes
                </p>
                <div className="mt-6 px-8 py-3 bg-white/20 rounded-full text-white font-semibold group-hover:bg-white/30 transition-colors">
                  Begin Your Journey →
                </div>
              </div>
            </div>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
