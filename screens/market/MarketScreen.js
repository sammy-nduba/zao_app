// Domain Layer - Entities
export class Product {
  constructor(id, name, price, originalPrice, imageUrl, rating = 0) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.originalPrice = originalPrice;
    this.imageUrl = imageUrl;
    this.rating = rating;
  }
}

export class Category {
  constructor(id, name, icon) {
    this.id = id;
    this.name = name;
    this.icon = icon;
  }
}

// Domain Layer - Repository Interface
export class ProductRepository {
  async getTopSellingProducts() {
    throw new Error('Method not implemented');
  }
  
  async getTopRatedProducts() {
    throw new Error('Method not implemented');
  }
  
  async getCategories() {
    throw new Error('Method not implemented');
  }
}

// Data Layer - Repository Implementation
export class ProductRepositoryImpl extends ProductRepository {
  constructor() {
    super();
    // Mock data - in real app, this would come from API
    this.topSellingProducts = [
      new Product(1, 'Product 1', 55.00, 100.97, 'https://via.placeholder.com/150x150/FFD700/000000?text=Seeds'),
      new Product(2, 'Product 2', 55.00, 100.97, 'https://via.placeholder.com/150x150/8B4513/FFFFFF?text=Fertilizer'),
      new Product(3, 'Product 3', 55.00, 100.97, 'https://via.placeholder.com/150x150/32CD32/000000?text=Equipment'),
    ];
    
    this.topRatedProducts = [
      new Product(4, 'Product 1', 55.00, 100.97, 'https://via.placeholder.com/150x150/4169E1/FFFFFF?text=Seeds', 4.5),
      new Product(5, 'Product 2', 55.00, 100.97, 'https://via.placeholder.com/150x150/228B22/FFFFFF?text=Sprout', 4.8),
      new Product(6, 'Product 3', 55.00, 100.97, 'https://via.placeholder.com/150x150/FFB6C1/000000?text=Flowers', 4.2),
    ];
    
    this.categories = [
      new Category(1, 'Seeds', '🌱'),
      new Category(2, 'Fertilizer', '🌿'),
      new Category(3, 'Equipment', '🚜'),
      new Category(4, 'Services', '🏞️'),
    ];
  }
  
  async getTopSellingProducts() {
    return this.topSellingProducts;
  }
  
  async getTopRatedProducts() {
    return this.topRatedProducts;
  }
  
  async getCategories() {
    return this.categories;
  }
}

// Domain Layer - Use Cases
export class GetTopSellingProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }
  
  async execute() {
    return await this.productRepository.getTopSellingProducts();
  }
}

export class GetTopRatedProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }
  
  async execute() {
    return await this.productRepository.getTopRatedProducts();
  }
}

export class GetCategoriesUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }
  
  async execute() {
    return await this.productRepository.getCategories();
  }
}

// Presentation Layer - ViewModel
export class MarketViewModel {
  constructor(
    getTopSellingProductsUseCase,
    getTopRatedProductsUseCase,
    getCategoriesUseCase
  ) {
    this.getTopSellingProductsUseCase = getTopSellingProductsUseCase;
    this.getTopRatedProductsUseCase = getTopRatedProductsUseCase;
    this.getCategoriesUseCase = getCategoriesUseCase;
  }
  
  async loadData() {
    try {
      const [topSelling, topRated, categories] = await Promise.all([
        this.getTopSellingProductsUseCase.execute(),
        this.getTopRatedProductsUseCase.execute(),
        this.getCategoriesUseCase.execute()
      ]);
      
      return {
        topSellingProducts: topSelling,
        topRatedProducts: topRated,
        categories: categories,
        loading: false,
        error: null
      };
    } catch (error) {
      return {
        topSellingProducts: [],
        topRatedProducts: [],
        categories: [],
        loading: false,
        error: error.message
      };
    }
  }
}

// Presentation Layer - Components
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// Category Component
const CategoryItem = ({ category }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIcon}>
      <Text style={styles.categoryEmoji}>{category.icon}</Text>
    </View>
    <Text style={styles.categoryText}>{category.name}</Text>
  </TouchableOpacity>
);

// Product Card Component
const ProductCard = ({ product, onPress, onFavorite }) => (
  <TouchableOpacity style={styles.productCard} onPress={() => onPress(product)}>
    <View style={styles.productImageContainer}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <TouchableOpacity style={styles.favoriteButton} onPress={() => onFavorite(product.id)}>
        <Text style={styles.favoriteIcon}>♡</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.productName}>{product.name}</Text>
    <View style={styles.priceContainer}>
      <Text style={styles.currentPrice}>Kes {product.price.toFixed(2)}</Text>
      <Text style={styles.originalPrice}>Kes{product.originalPrice.toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);

// Product Section Component
const ProductSection = ({ title, products, onProductPress, onFavoritePress, onSeeAll }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={onProductPress}
          onFavorite={onFavoritePress}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.productList}
    />
  </View>
);

// Main Screen Component
const ZaoMarketScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState({
    topSellingProducts: [],
    topRatedProducts: [],
    categories: [],
    loading: true,
    error: null
  });

  // Dependency Injection
  const productRepository = new ProductRepositoryImpl();
  const getTopSellingProductsUseCase = new GetTopSellingProductsUseCase(productRepository);
  const getTopRatedProductsUseCase = new GetTopRatedProductsUseCase(productRepository);
  const getCategoriesUseCase = new GetCategoriesUseCase(productRepository);
  const viewModel = new MarketViewModel(
    getTopSellingProductsUseCase,
    getTopRatedProductsUseCase,
    getCategoriesUseCase
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await viewModel.loadData();
    setData(result);
  };

  const handleProductPress = (product) => {
    console.log('Product pressed:', product.name);
    // Navigate to product details
  };

  const handleFavoritePress = (productId) => {
    console.log('Favorite pressed:', productId);
    // Toggle favorite status
  };

  const handleSeeAll = (section) => {
    console.log('See all pressed:', section);
    // Navigate to products list
  };

  const handleCategoryPress = (category) => {
    console.log('Category pressed:', category.name);
    // Navigate to category products
  };

  if (data.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Zao Market</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.iconText}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.iconText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Farm"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => handleSeeAll('categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesContainer}>
            {data.categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </View>
        </View>

        {/* Top Selling Products */}
        <ProductSection
          title="Top Selling"
          products={data.topSellingProducts}
          onProductPress={handleProductPress}
          onFavoritePress={handleFavoritePress}
          onSeeAll={() => handleSeeAll('top-selling')}
        />

        {/* Top Rated Products */}
        <ProductSection
          title="Top Rated"
          products={data.topRatedProducts}
          onProductPress={handleProductPress}
          onFavoritePress={handleFavoritePress}
          onSeeAll={() => handleSeeAll('top-rated')}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔗</Text>
          <Text style={styles.navText}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navIcon}>🏪</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🤖</Text>
          <Text style={styles.navText}>Ai</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  productList: {
    paddingLeft: 0,
  },
  productCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 14,
    color: '#333',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    padding: 8,
    paddingBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 4,
  },
  currentPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  navText: {
    fontSize: 10,
    color: '#fff',
  },
  navTextActive: {
    fontWeight: 'bold',
  },
});

export default ZaoMarketScreen;