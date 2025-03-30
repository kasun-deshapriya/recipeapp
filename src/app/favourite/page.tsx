"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logout from "../login/_component/logout";
import Image from "next/image";

interface Category {
  idCategory: number;
  item_id: number;
  strCategory: string;
  strCategoryDescription: string;
  strCategoryThumb: string;
}

function FavItem() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  const [categories, setCategories] = useState<Category[]>([]);
  const [favouriteitem, setFavouriteItem] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>("All");

  const tabs = ["All", "Pork", "Beef", "Chicken", "Lamb", "Pasta"];

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFavouriteItem = async () => {
      try {
        const response = await fetch(`${api_url}/favourites`, {
          credentials: "include",
        });
        if (!response.ok) {
          router.push("login");
        }
        const data = await response.json();
        //  console.log("data", data.data);
        setFavouriteItem(data.data);
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteItem();
  }, []);

  console.log("categories", favouriteitem);
  console.log("filteredCategories", filteredCategories);

  // Filter favouriteItem from categories
  const filterCategories = () => {
    if (favouriteitem) {
      const filtered = categories.filter((category) =>
        favouriteitem.some(
          (fav) => fav?.item_id?.toString() === category?.idCategory?.toString()
        )
      );
      setFilteredCategories(filtered);
    }
  };

  useEffect(() => {
    filterCategories();
  }, [categories, favouriteitem]);

  // **Filter categories based on selected tab**
  const filteredCategoriesfortab =
    selectedTab === "All"
      ? filteredCategories
      : filteredCategories.filter((category) =>
          category.strCategory.toLowerCase().includes(selectedTab.toLowerCase())
        );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-[#FF4E79]">co</span>
              <Search size={32} className="text-[#FF4E79]" />
              <span className="text-4xl font-bold text-[#FF4E79]">k</span>
            </div>
            <nav className="flex space-x-8">
              <a href="home" className="text-gray-500 hover:text-gray-700">
                HOME
              </a>
              <a href="#" className="text-gray-900 hover:text-gray-700">
                FAVOURITE
              </a>
            </nav>
            <Logout></Logout>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex space-x-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedTab === tab
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 border border-pink-500"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {loading ? (
            <p className="text-gray-500 text-center">Loading categories...</p>
          ) : filteredCategoriesfortab.length > 0 ? (
            filteredCategoriesfortab.map((category) => (
              <div key={category.idCategory} className="">
                <div className="w-full bg-slate-200 h-32 rounded-3xl">
                  <Image
                    src={category.strCategoryThumb}
                    alt={category.strCategory}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-t-3xl"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">
                      {category.strCategory}
                    </span>
                    <Heart className="h-4 w-4 text-red-400 fill-current" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.strCategory} Noodle Soup
                  </h3>
                  <div className="flex justify-end">
                    <Dialog>
                      <DialogTrigger className="text-blue-400 cursor-pointer">
                        view
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {" "}
                            {category.strCategory} Noodle Soup
                          </DialogTitle>
                          <DialogDescription>
                            {category.strCategoryDescription}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories available.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default FavItem;
