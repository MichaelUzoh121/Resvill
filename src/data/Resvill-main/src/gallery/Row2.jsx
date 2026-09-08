import React, { useState } from "react";
import { Expand, X } from "lucide-react";

const filters = ["All", "Food", "Interior", "Moments"];

const galleryItems = [
  {
    src: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    caption: "Jollof Rice & Chicken",
    category: "Food",
  },
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    caption: "Classic Beef Burger",
    category: "Food",
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
    caption: "Our dining space",
    category: "Interior",
  },
  {
    src: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85",
    caption: "Chicken Shawarma",
    category: "Food",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85",
    caption: "Good food, good company",
    category: "Moments",
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    caption: "Fresh off the grill",
    category: "Food",
  },
  {
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85",
    caption: "Behind the scenes",
    category: "Interior",
  },
  {
    src: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
    caption: "A table set for you",
    category: "Moments",
  },
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    caption: "Rice bowls, done right",
    category: "Food",
  },
];

function Row2() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section className="bg-dark-50 px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                activeFilter === filter
                  ? "bg-primary-500 text-white shadow-md"
                  : "border border-dark-200 bg-white text-dark-700 hover:border-primary-300 hover:text-primary-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-square overflow-hidden rounded-3xl bg-dark-100 shadow-soft"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-dark-950/80 via-dark-950/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-left text-sm font-bold text-white">
                  {item.caption}
                </p>
              </div>

              <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-dark-800 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                <Expand size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950/90 p-5 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setSelectedImage(null)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <div
            className="max-h-[85vh] max-w-3xl overflow-hidden rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.caption}
              className="max-h-[85vh] w-full object-contain"
            />

            <p className="bg-dark-950 py-3 text-center text-sm font-semibold text-white">
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Row2;
