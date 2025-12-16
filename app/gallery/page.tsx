'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { galleryService } from '@/lib/database';
import type { GalleryImage } from '@/lib/supabase';

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['all', 'experiments', 'workshops', 'projects', 'events'];

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const data = await galleryService.getActiveImages(selectedCategory);
      setImages(data || []);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages = images;

  return (
    <div className="min-h-screen pt-20">
      <section className="relative bg-gradient-hero py-24 overflow-hidden">
        <div className="absolute inset-0 bg-pattern-circuit opacity-30" />
        <div className="relative z-10 container-custom px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Program <span className="text-accent-cyan">Gallery</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Explore moments from our hands-on science and innovation sessions
          </p>
        </div>
      </section>

      <section className="section-padding bg-primary-navy">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-cyan text-white shadow-glow-cyan-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
              <p className="text-white/60 text-lg mt-4">Loading gallery...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative group cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="aspect-square bg-gradient-section">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-navy via-primary-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                        <span className="inline-block mt-2 px-3 py-1 bg-accent-cyan/20 text-accent-cyan text-sm rounded-full">
                          {image.category}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-cyan rounded-xl transition-colors duration-300" />
                  </div>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-white/60 text-lg">No images found in this category</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-primary-navy/95 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-accent-cyan/20 hover:bg-accent-cyan flex items-center justify-center transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredImages[selectedImage].url}
              alt={filteredImages[selectedImage].title}
              className="w-full rounded-xl shadow-glow-cyan border-2 border-accent-cyan/30"
            />
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {filteredImages[selectedImage].title}
              </h3>
              <span className="inline-block px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-full">
                {filteredImages[selectedImage].category}
              </span>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage > 0 ? selectedImage - 1 : filteredImages.length - 1);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-accent-cyan text-white rounded-lg transition-all"
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage < filteredImages.length - 1 ? selectedImage + 1 : 0);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-accent-cyan text-white rounded-lg transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
