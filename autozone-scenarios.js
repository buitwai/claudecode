/**
 * AutoZone-Specific Training Scenarios for Claude Code
 * Real-world scenarios and examples tailored for AutoZone development workflows
 */

class AutoZoneScenarios {
    constructor(simulator, exerciseEngine) {
        this.simulator = simulator;
        this.exerciseEngine = exerciseEngine;
        this.scenarios = this.initializeScenarios();
        this.realWorldExamples = this.initializeRealWorldExamples();
        this.codeTemplates = this.initializeCodeTemplates();
        
        // Add AutoZone-specific exercises to the exercise engine
        this.addAutoZoneExercises();
    }

    /**
     * Initialize AutoZone-specific scenarios
     */
    initializeScenarios() {
        return {
            'microservice-setup': {
                title: 'Microservice Architecture Setup',
                description: 'Set up a new microservice following AutoZone patterns',
                difficulty: 'intermediate',
                domain: 'backend',
                technologies: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL'],
                scenario: `You're tasked with creating a new inventory management microservice for AutoZone's 
e-commerce platform. The service needs to handle product inventory updates, stock level monitoring, 
and integration with the existing order management system.`,
                requirements: [
                    'Use TypeScript for type safety',
                    'Implement RESTful API endpoints',
                    'Add comprehensive error handling',
                    'Include proper logging and monitoring',
                    'Follow AutoZone security guidelines',
                    'Write unit and integration tests'
                ],
                acceptanceCriteria: [
                    'API responds to inventory queries',
                    'Stock updates are atomic and consistent',
                    'Proper authentication and authorization',
                    'Error responses follow API standards',
                    'All endpoints have test coverage'
                ]
            },

            'legacy-integration': {
                title: 'Legacy System Integration',
                description: 'Integrate with AutoZone legacy systems while modernizing',
                difficulty: 'advanced',
                domain: 'integration',
                technologies: ['Java', 'Spring Boot', 'REST', 'SOAP', 'XML'],
                scenario: `AutoZone needs to integrate a new customer portal with the existing mainframe-based 
inventory system. The legacy system uses SOAP services and XML messaging, while the new portal 
requires modern REST APIs with JSON responses.`,
                requirements: [
                    'Create adapter layer for legacy integration',
                    'Transform XML to JSON responses',
                    'Handle legacy system timeouts gracefully',
                    'Implement caching for performance',
                    'Add monitoring and alerting',
                    'Ensure backward compatibility'
                ],
                acceptanceCriteria: [
                    'New portal can query inventory data',
                    'Response times under 500ms',
                    'Graceful handling of legacy downtime',
                    'Proper error mapping and logging',
                    'Cache hit ratio above 80%'
                ]
            },

            'mobile-app-feature': {
                title: 'Mobile App Feature Development',
                description: 'Add new feature to AutoZone mobile app',
                difficulty: 'intermediate',
                domain: 'mobile',
                technologies: ['React Native', 'TypeScript', 'Redux', 'Jest'],
                scenario: `The AutoZone mobile app needs a new feature allowing customers to scan barcodes 
in-store to check product availability, compare prices, and add items to their cart for pickup or delivery.`,
                requirements: [
                    'Implement barcode scanning functionality',
                    'Create product lookup API integration',
                    'Add to shopping cart with store selection',
                    'Handle offline scenarios gracefully',
                    'Follow mobile UI/UX guidelines',
                    'Ensure accessibility compliance'
                ],
                acceptanceCriteria: [
                    'Barcode scanning works accurately',
                    'Product info displays within 2 seconds',
                    'Cart persistence across app sessions',
                    'Offline mode with sync capability',
                    'Passes accessibility audit'
                ]
            },

            'data-pipeline': {
                title: 'Real-time Data Pipeline',
                description: 'Build data pipeline for inventory analytics',
                difficulty: 'advanced',
                domain: 'data',
                technologies: ['Apache Kafka', 'Apache Spark', 'Python', 'Docker'],
                scenario: `AutoZone needs a real-time data pipeline to process inventory changes across 
6,000+ stores and provide instant analytics for demand forecasting, stock optimization, and automated reordering.`,
                requirements: [
                    'Process high-volume inventory events',
                    'Real-time aggregation and analytics',
                    'Integration with ML prediction models',
                    'Scalable architecture for growth',
                    'Data quality validation and monitoring',
                    'Disaster recovery and backup strategy'
                ],
                acceptanceCriteria: [
                    'Process 1M+ events per hour',
                    'Sub-second latency for aggregations',
                    ' 99.9% uptime requirement',
                    'Automated data quality checks',
                    'Complete audit trail for compliance'
                ]
            },

            'security-audit': {
                title: 'Security Vulnerability Remediation',
                description: 'Address security findings in AutoZone application',
                difficulty: 'advanced',
                domain: 'security',
                technologies: ['OWASP', 'JWT', 'OAuth', 'Encryption'],
                scenario: `A security audit has identified several vulnerabilities in the customer portal 
including SQL injection risks, inadequate input validation, and weak authentication mechanisms that need immediate remediation.`,
                requirements: [
                    'Fix SQL injection vulnerabilities',
                    'Implement proper input validation',
                    'Strengthen authentication mechanisms',
                    'Add rate limiting and DDoS protection',
                    'Implement proper session management',
                    'Add security headers and HTTPS enforcement'
                ],
                acceptanceCriteria: [
                    'All OWASP Top 10 vulnerabilities addressed',
                    'Penetration test passes without critical findings',
                    'Security scan reports zero high-risk issues',
                    'Authentication follows OAuth 2.0 standards',
                    'All data in transit and at rest encrypted'
                ]
            },

            'performance-optimization': {
                title: 'Application Performance Optimization',
                description: 'Optimize AutoZone web application performance',
                difficulty: 'intermediate',
                domain: 'performance',
                technologies: ['React', 'Node.js', 'CDN', 'Caching'],
                scenario: `The AutoZone website is experiencing slow load times during peak traffic periods. 
Customer satisfaction scores are declining due to page load times exceeding 5 seconds, particularly on the product search and checkout pages.`,
                requirements: [
                    'Optimize database queries and indexing',
                    'Implement caching strategies',
                    'Add CDN for static assets',
                    'Optimize frontend bundle size',
                    'Implement lazy loading for images',
                    'Add performance monitoring'
                ],
                acceptanceCriteria: [
                    'Page load times under 2 seconds',
                    'First Contentful Paint under 1.5 seconds',
                    'Lighthouse score above 90',
                    'Database query times under 100ms',
                    'Customer satisfaction improvement of 20%'
                ]
            }
        };
    }

    /**
     * Initialize real-world code examples
     */
    initializeRealWorldExamples() {
        return {
            'inventory-service': {
                title: 'Inventory Service Implementation',
                language: 'typescript',
                description: 'Complete implementation of inventory microservice',
                code: `// src/services/InventoryService.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/Inventory';
import { InventoryUpdateDto } from '../dto/InventoryUpdateDto';
import { CacheService } from './CacheService';
import { MetricsService } from './MetricsService';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private cacheService: CacheService,
    private metricsService: MetricsService,
  ) {}

  async getInventoryByStoreAndSku(
    storeId: string,
    sku: string,
  ): Promise<Inventory | null> {
    const cacheKey = \`inventory:\${storeId}:\${sku}\`;
    
    // Check cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      this.metricsService.incrementCacheHit('inventory_lookup');
      return JSON.parse(cached);
    }

    try {
      const inventory = await this.inventoryRepository.findOne({
        where: { storeId, sku },
        relations: ['product', 'store'],
      });

      if (inventory) {
        // Cache for 5 minutes
        await this.cacheService.set(
          cacheKey,
          JSON.stringify(inventory),
          300,
        );
      }

      this.metricsService.incrementCacheMiss('inventory_lookup');
      return inventory;
    } catch (error) {
      this.logger.error(
        \`Failed to fetch inventory for store \${storeId}, SKU \${sku}\`,
        error.stack,
      );
      throw error;
    }
  }

  async updateInventory(
    storeId: string,
    sku: string,
    updateDto: InventoryUpdateDto,
  ): Promise<Inventory> {
    const startTime = Date.now();
    
    return this.inventoryRepository.manager.transaction(
      async (transactionManager) => {
        try {
          // Lock the inventory record
          const inventory = await transactionManager.findOne(Inventory, {
            where: { storeId, sku },
            lock: { mode: 'pessimistic_write' },
          });

          if (!inventory) {
            throw new Error(\`Inventory not found for store \${storeId}, SKU \${sku}\`);
          }

          // Validate stock levels
          if (updateDto.quantityChange < 0 && 
              inventory.quantity + updateDto.quantityChange < 0) {
            throw new Error('Insufficient inventory for requested operation');
          }

          // Update inventory
          inventory.quantity += updateDto.quantityChange;
          inventory.lastUpdated = new Date();
          inventory.updatedBy = updateDto.userId;

          const updatedInventory = await transactionManager.save(inventory);

          // Invalidate cache
          const cacheKey = \`inventory:\${storeId}:\${sku}\`;
          await this.cacheService.delete(cacheKey);

          // Log the update
          this.logger.log(
            \`Inventory updated: Store \${storeId}, SKU \${sku}, ` +
            \`Change: \${updateDto.quantityChange}, New Quantity: \${updatedInventory.quantity}\`
          );

          // Record metrics
          this.metricsService.recordLatency(
            'inventory_update',
            Date.now() - startTime,
          );

          return updatedInventory;
        } catch (error) {
          this.logger.error(
            \`Failed to update inventory for store \${storeId}, SKU \${sku}\`,
            error.stack,
          );
          throw error;
        }
      },
    );
  }

  async getBulkInventory(
    storeId: string,
    skus: string[],
  ): Promise<Inventory[]> {
    if (skus.length === 0) {
      return [];
    }

    if (skus.length > 100) {
      throw new Error('Bulk request limited to 100 SKUs');
    }

    try {
      const inventories = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .leftJoinAndSelect('inventory.product', 'product')
        .where('inventory.storeId = :storeId', { storeId })
        .andWhere('inventory.sku IN (:...skus)', { skus })
        .getMany();

      return inventories;
    } catch (error) {
      this.logger.error(
        \`Failed to fetch bulk inventory for store \${storeId}\`,
        error.stack,
      );
      throw error;
    }
  }
}`
            },

            'barcode-scanner': {
                title: 'Mobile Barcode Scanner Component',
                language: 'typescript',
                description: 'React Native barcode scanner with camera integration',
                code: `// src/components/BarcodeScanner.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Vibration,
  Dimensions,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ProductService } from '../services/ProductService';
import { addToCart } from '../store/cartSlice';
import { RootState } from '../store/store';
import LoadingSpinner from './LoadingSpinner';
import ScanOverlay from './ScanOverlay';

interface BarcodeScannerProps {
  onProductFound: (product: Product) => void;
  onError: (error: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onProductFound,
  onError,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectedStore = useSelector((state: RootState) => state.user.selectedStore);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access to scan barcodes.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => /* Open settings */ },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      onError('Failed to request camera permission');
    }
  };

  const handleBarCodeScanned = async ({ type, data }: BarCodeScanningResult) => {
    if (scanned || isLoading) return;

    setScanned(true);
    setIsLoading(true);
    
    // Provide haptic feedback
    Vibration.vibrate(100);

    try {
      // Validate barcode format
      if (!isValidBarcode(data)) {
        throw new Error('Invalid barcode format');
      }

      // Look up product by barcode
      const product = await ProductService.getProductByBarcode(
        data,
        selectedStore?.id || ''
      );

      if (!product) {
        throw new Error('Product not found');
      }

      // Check inventory availability
      const inventory = await ProductService.getInventory(
        product.sku,
        selectedStore?.id || ''
      );

      if (!inventory || inventory.quantity <= 0) {
        Alert.alert(
          'Out of Stock',
          \`\${product.name} is currently out of stock at this location.\`,
          [
            { text: 'OK', onPress: resetScanner },
            { 
              text: 'Check Other Stores', 
              onPress: () => navigation.navigate('StoreLocator', { sku: product.sku })
            },
          ]
        );
        return;
      }

      // Product found and in stock
      onProductFound({
        ...product,
        inventory,
        storeInfo: selectedStore,
      });

      // Show product details with option to add to cart
      Alert.alert(
        'Product Found',
        \`\${product.name}\\nPrice: $\${product.price}\\nIn Stock: \${inventory.quantity}\`,
        [
          { text: 'Continue Scanning', onPress: resetScanner },
          { 
            text: 'Add to Cart', 
            onPress: () => handleAddToCart(product, inventory)
          },
          { 
            text: 'View Details', 
            onPress: () => navigation.navigate('ProductDetails', { 
              productId: product.id 
            })
          },
        ]
      );

    } catch (error) {
      console.error('Barcode scan error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to process barcode';
        
      Alert.alert(
        'Scan Error',
        errorMessage,
        [{ text: 'Try Again', onPress: resetScanner }]
      );
      
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product: Product, inventory: any) => {
    try {
      dispatch(addToCart({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        quantity: 1,
        storeId: selectedStore?.id || '',
        maxQuantity: inventory.quantity,
      }));

      Alert.alert(
        'Added to Cart',
        \`\${product.name} has been added to your cart.\`,
        [
          { text: 'Continue Shopping', onPress: resetScanner },
          { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
        ]
      );
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
      resetScanner();
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsLoading(false);
  };

  const isValidBarcode = (barcode: string): boolean => {
    // UPC-A: 12 digits
    // EAN-13: 13 digits
    // Code 128: Variable length alphanumeric
    const upcRegex = /^\\d{12}$/;
    const eanRegex = /^\\d{13}$/;
    const code128Regex = /^[A-Za-z0-9\\-\\.\\s\\$\\/\\+\\%]+$/;
    
    return upcRegex.test(barcode) || 
           eanRegex.test(barcode) || 
           code128Regex.test(barcode);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner />
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Camera access denied</Text>
        <Text style={styles.statusText}>
          Please enable camera access in settings to scan barcodes.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barCodeScannerSettings={{
          barCodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        onCameraReady={() => setCameraReady(true)}
      >
        <ScanOverlay 
          isScanning={!scanned && cameraReady}
          isLoading={isLoading}
        />
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LoadingSpinner size="large" />
            <Text style={styles.loadingText}>Looking up product...</Text>
          </View>
        )}
      </CameraView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default BarcodeScanner;`
            },

            'kafka-consumer': {
                title: 'Kafka Event Consumer for Inventory Updates',
                language: 'python',
                description: 'Python Kafka consumer for real-time inventory processing',
                code: `# inventory_processor.py
import asyncio
import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime

from aiokafka import AIOKafkaConsumer
from aiokafka.errors import KafkaError
import asyncpg
import redis.asyncio as redis
from prometheus_client import Counter, Histogram, Gauge
import structlog

# Metrics
EVENTS_PROCESSED = Counter('inventory_events_processed_total', 
                          'Total processed inventory events', ['event_type', 'status'])
PROCESSING_TIME = Histogram('inventory_event_processing_seconds',
                           'Time spent processing inventory events')
ACTIVE_CONSUMERS = Gauge('inventory_consumers_active', 
                        'Number of active inventory consumers')

logger = structlog.get_logger()

class InventoryEventProcessor:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.consumer = None
        self.db_pool = None
        self.redis_client = None
        self.running = False
        
    async def start(self):
        """Initialize and start the inventory event processor"""
        try:
            # Initialize Kafka consumer
            self.consumer = AIOKafkaConsumer(
                'inventory.events',
                bootstrap_servers=self.config['kafka']['bootstrap_servers'],
                group_id=self.config['kafka']['group_id'],
                auto_offset_reset='latest',
                enable_auto_commit=True,
                value_deserializer=lambda x: json.loads(x.decode('utf-8')),
                consumer_timeout_ms=1000,
                max_poll_records=100
            )
            
            # Initialize database connection pool
            self.db_pool = await asyncpg.create_pool(
                host=self.config['database']['host'],
                port=self.config['database']['port'],
                user=self.config['database']['user'],
                password=self.config['database']['password'],
                database=self.config['database']['name'],
                min_size=5,
                max_size=20,
                command_timeout=30
            )
            
            # Initialize Redis client for caching
            self.redis_client = redis.Redis(
                host=self.config['redis']['host'],
                port=self.config['redis']['port'],
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            
            await self.consumer.start()
            ACTIVE_CONSUMERS.inc()
            self.running = True
            
            logger.info("Inventory event processor started", 
                       group_id=self.config['kafka']['group_id'])
            
            await self.consume_events()
            
        except Exception as e:
            logger.error("Failed to start inventory processor", error=str(e))
            await self.stop()
            raise
    
    async def stop(self):
        """Stop the event processor and cleanup resources"""
        self.running = False
        
        if self.consumer:
            await self.consumer.stop()
            ACTIVE_CONSUMERS.dec()
            
        if self.db_pool:
            await self.db_pool.close()
            
        if self.redis_client:
            await self.redis_client.close()
            
        logger.info("Inventory event processor stopped")
    
    async def consume_events(self):
        """Main event consumption loop"""
        while self.running:
            try:
                # Fetch a batch of messages
                msg_pack = await self.consumer.getmany(timeout_ms=5000)
                
                if not msg_pack:
                    continue
                
                # Process messages in parallel batches
                tasks = []
                for topic_partition, messages in msg_pack.items():
                    for message in messages:
                        task = asyncio.create_task(
                            self.process_event(message.value, message.key)
                        )
                        tasks.append(task)
                
                # Wait for all messages in batch to complete
                if tasks:
                    await asyncio.gather(*tasks, return_exceptions=True)
                    
            except KafkaError as e:
                logger.error("Kafka consumer error", error=str(e))
                await asyncio.sleep(5)  # Back off on errors
                
            except Exception as e:
                logger.error("Unexpected error in consume loop", error=str(e))
                await asyncio.sleep(1)
    
    @PROCESSING_TIME.time()
    async def process_event(self, event_data: Dict[str, Any], message_key: Optional[bytes]):
        """Process a single inventory event"""
        start_time = datetime.utcnow()
        event_type = event_data.get('event_type', 'unknown')
        
        try:
            # Validate event structure
            if not self.validate_event(event_data):
                EVENTS_PROCESSED.labels(event_type=event_type, status='invalid').inc()
                logger.warning("Invalid event structure", event=event_data)
                return
            
            # Extract event details
            store_id = event_data['store_id']
            sku = event_data['sku']
            quantity_change = event_data.get('quantity_change', 0)
            event_timestamp = datetime.fromisoformat(event_data['timestamp'])
            
            # Process based on event type
            if event_type == 'inventory_adjustment':
                await self.handle_inventory_adjustment(
                    store_id, sku, quantity_change, event_timestamp, event_data
                )
            elif event_type == 'sale_transaction':
                await self.handle_sale_transaction(
                    store_id, sku, quantity_change, event_timestamp, event_data
                )
            elif event_type == 'shipment_received':
                await self.handle_shipment_received(
                    store_id, sku, quantity_change, event_timestamp, event_data
                )
            elif event_type == 'transfer_out':
                await self.handle_transfer_out(
                    store_id, sku, quantity_change, event_timestamp, event_data
                )
            else:
                logger.warning("Unknown event type", event_type=event_type)
                EVENTS_PROCESSED.labels(event_type=event_type, status='unknown').inc()
                return
            
            EVENTS_PROCESSED.labels(event_type=event_type, status='success').inc()
            
            # Log processing metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.info("Event processed successfully",
                       event_type=event_type,
                       store_id=store_id,
                       sku=sku,
                       processing_time_ms=processing_time * 1000)
                       
        except Exception as e:
            EVENTS_PROCESSED.labels(event_type=event_type, status='error').inc()
            logger.error("Failed to process event",
                        event_type=event_type,
                        error=str(e),
                        event=event_data)
    
    async def handle_inventory_adjustment(
        self, 
        store_id: str, 
        sku: str, 
        quantity_change: int,
        timestamp: datetime,
        event_data: Dict[str, Any]
    ):
        """Handle inventory adjustment events"""
        async with self.db_pool.acquire() as conn:
            async with conn.transaction():
                # Update inventory in database
                result = await conn.fetchrow("""
                    UPDATE inventory 
                    SET quantity = quantity + $1,
                        last_updated = $2,
                        updated_by = $3
                    WHERE store_id = $4 AND sku = $5
                    RETURNING quantity, last_updated
                """, quantity_change, timestamp, 
                    event_data.get('user_id', 'system'), store_id, sku)
                
                if not result:
                    # Create new inventory record if doesn't exist
                    await conn.execute("""
                        INSERT INTO inventory (store_id, sku, quantity, last_updated, created_by)
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (store_id, sku) DO UPDATE
                        SET quantity = inventory.quantity + $3,
                            last_updated = $4
                    """, store_id, sku, quantity_change, timestamp,
                        event_data.get('user_id', 'system'))
                    
                    new_quantity = quantity_change
                else:
                    new_quantity = result['quantity']
                
                # Update cache
                cache_key = f"inventory:{store_id}:{sku}"
                await self.redis_client.setex(
                    cache_key, 
                    300,  # 5 minute cache
                    json.dumps({
                        'store_id': store_id,
                        'sku': sku,
                        'quantity': new_quantity,
                        'last_updated': timestamp.isoformat()
                    })
                )
                
                # Check for low stock alerts
                if new_quantity <= 10:  # Configurable threshold
                    await self.send_low_stock_alert(store_id, sku, new_quantity)
    
    async def handle_sale_transaction(
        self,
        store_id: str,
        sku: str,
        quantity_change: int,
        timestamp: datetime,
        event_data: Dict[str, Any]
    ):
        """Handle sale transaction events (typically negative quantity changes)"""
        # Sale transactions should always decrease inventory
        if quantity_change > 0:
            logger.warning("Sale transaction with positive quantity change",
                          store_id=store_id, sku=sku, quantity_change=quantity_change)
        
        await self.handle_inventory_adjustment(
            store_id, sku, quantity_change, timestamp, event_data
        )
        
        # Update sales analytics
        await self.update_sales_analytics(store_id, sku, abs(quantity_change), timestamp)
    
    async def send_low_stock_alert(self, store_id: str, sku: str, current_quantity: int):
        """Send low stock alert"""
        alert_data = {
            'alert_type': 'low_stock',
            'store_id': store_id,
            'sku': sku,
            'current_quantity': current_quantity,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Publish alert to alerts topic
        # This would typically use another Kafka producer
        logger.warning("Low stock alert", **alert_data)
    
    def validate_event(self, event_data: Dict[str, Any]) -> bool:
        """Validate event data structure"""
        required_fields = ['event_type', 'store_id', 'sku', 'timestamp']
        return all(field in event_data for field in required_fields)

# Main entry point
async def main():
    config = {
        'kafka': {
            'bootstrap_servers': ['kafka-1:9092', 'kafka-2:9092'],
            'group_id': 'inventory-processor-v1'
        },
        'database': {
            'host': 'postgres-primary.autozone.com',
            'port': 5432,
            'user': 'inventory_processor',
            'password': 'secure_password',
            'name': 'inventory_db'
        },
        'redis': {
            'host': 'redis-cluster.autozone.com',
            'port': 6379
        }
    }
    
    processor = InventoryEventProcessor(config)
    
    try:
        await processor.start()
    except KeyboardInterrupt:
        logger.info("Shutdown signal received")
    finally:
        await processor.stop()

if __name__ == "__main__":
    asyncio.run(main())`
            }
        };
    }

    /**
     * Initialize code templates for common AutoZone patterns
     */
    initializeCodeTemplates() {
        return {
            'microservice-controller': {
                language: 'typescript',
                template: `// src/controllers/{entityName}Controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { {EntityName}Service } from '../services/{EntityName}Service';
import { Create{EntityName}Dto, Update{EntityName}Dto, {EntityName}ResponseDto } from '../dto/{entityName}.dto';
import { AuthGuard } from '../guards/AuthGuard';
import { RolesGuard } from '../guards/RolesGuard';
import { Roles } from '../decorators/Roles';
import { PaginationDto } from '../dto/PaginationDto';

@ApiTags('{entityName}')
@Controller('{entityName}')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class {EntityName}Controller {
  constructor(private readonly {entityName}Service: {EntityName}Service) {}

  @Get()
  @ApiOperation({ summary: 'Get all {entityName}s' })
  @ApiResponse({ status: 200, description: 'List of {entityName}s', type: [{EntityName}ResponseDto] })
  @Roles('user', 'admin')
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.{entityName}Service.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get {entityName} by ID' })
  @ApiResponse({ status: 200, description: '{EntityName} found', type: {EntityName}ResponseDto })
  @ApiResponse({ status: 404, description: '{EntityName} not found' })
  @Roles('user', 'admin')
  async findOne(@Param('id') id: string) {
    return this.{entityName}Service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new {entityName}' })
  @ApiResponse({ status: 201, description: '{EntityName} created', type: {EntityName}ResponseDto })
  @Roles('admin')
  async create(@Body() create{EntityName}Dto: Create{EntityName}Dto) {
    return this.{entityName}Service.create(create{EntityName}Dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update {entityName}' })
  @ApiResponse({ status: 200, description: '{EntityName} updated', type: {EntityName}ResponseDto })
  @ApiResponse({ status: 404, description: '{EntityName} not found' })
  @Roles('admin')
  async update(@Param('id') id: string, @Body() update{EntityName}Dto: Update{EntityName}Dto) {
    return this.{entityName}Service.update(id, update{EntityName}Dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete {entityName}' })
  @ApiResponse({ status: 204, description: '{EntityName} deleted' })
  @ApiResponse({ status: 404, description: '{EntityName} not found' })
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.{entityName}Service.remove(id);
  }
}`
            },

            'react-component': {
                language: 'typescript',
                template: `// src/components/{ComponentName}.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { {actionName} } from '../store/{sliceName}Slice';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './styles/{ComponentName}.scss';

interface {ComponentName}Props {
  className?: string;
  onAction?: (data: any) => void;
}

const {ComponentName}: React.FC<{ComponentName}Props> = ({
  className = '',
  onAction
}) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.{sliceName});
  
  const [localState, setLocalState] = useState<any>(null);

  useEffect(() => {
    // Component initialization
    dispatch({actionName}());
  }, [dispatch]);

  const handleAction = useCallback((actionData: any) => {
    if (onAction) {
      onAction(actionData);
    }
    // Additional action handling
  }, [onAction]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={\`{componentName} \${className}\`}>
      <h2>{ComponentName}</h2>
      {/* Component content */}
    </div>
  );
};

export default {ComponentName};`
            },

            'api-integration': {
                language: 'typescript',
                template: `// src/services/{ServiceName}Service.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types/api';
import { {EntityType} } from '../types/{entityType}';
import { Logger } from '../utils/Logger';
import { MetricsCollector } from '../utils/MetricsCollector';

class {ServiceName}Service {
  private client: AxiosInstance;
  private logger = new Logger('{ServiceName}Service');
  private metrics = new MetricsCollector();

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`,
        'X-Client-Version': process.env.CLIENT_VERSION || '1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const requestId = this.generateRequestId();
        config.headers['X-Request-ID'] = requestId;
        
        this.logger.info('API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          requestId,
        });

        return config;
      },
      (error) => {
        this.logger.error('Request Error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const requestId = response.config.headers['X-Request-ID'];
        
        this.logger.info('API Response', {
          status: response.status,
          requestId,
          duration: this.calculateDuration(response.config),
        });

        this.metrics.recordApiCall(
          response.config.url || '',
          response.status,
          this.calculateDuration(response.config)
        );

        return response;
      },
      (error) => {
        const requestId = error.config?.headers['X-Request-ID'];
        
        this.logger.error('API Error', {
          status: error.response?.status,
          message: error.message,
          requestId,
        });

        this.metrics.recordApiError(
          error.config?.url || '',
          error.response?.status || 0
        );

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  async getAll(params?: any): Promise<PaginatedResponse<{EntityType}>> {
    try {
      const response = await this.client.get<PaginatedResponse<{EntityType}>>('/{endpoint}', {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch {entityType}s');
    }
  }

  async getById(id: string): Promise<{EntityType}> {
    try {
      const response = await this.client.get<ApiResponse<{EntityType}>>(\`/{endpoint}/\${id}\`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, \`Failed to fetch {entityType} with ID: \${id}\`);
    }
  }

  async create(data: Partial<{EntityType}>): Promise<{EntityType}> {
    try {
      const response = await this.client.post<ApiResponse<{EntityType}>>('/{endpoint}', data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create {entityType}');
    }
  }

  async update(id: string, data: Partial<{EntityType}>): Promise<{EntityType}> {
    try {
      const response = await this.client.put<ApiResponse<{EntityType}>>(\`/{endpoint}/\${id}\`, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error, \`Failed to update {entityType} with ID: \${id}\`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.client.delete(\`/{endpoint}/\${id}\`);
    } catch (error) {
      throw this.handleError(error, \`Failed to delete {entityType} with ID: \${id}\`);
    }
  }

  private handleError(error: any, context: string): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      return new Error(\`\${context}: \${message}\`);
    } else if (error.request) {
      // Network error
      return new Error(\`\${context}: Network error\`);
    } else {
      // Something else
      return new Error(\`\${context}: \${error.message}\`);
    }
  }

  private generateRequestId(): string {
    return \`req_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  private calculateDuration(config: AxiosRequestConfig): number {
    const startTime = config.metadata?.startTime || Date.now();
    return Date.now() - startTime;
  }
}

export default {ServiceName}Service;`
            }
        };
    }

    /**
     * Add AutoZone-specific exercises to the exercise engine
     */
    addAutoZoneExercises() {
        const autoZoneExercises = {
            'az-environment-setup': {
                id: 'az-environment-setup',
                title: 'AutoZone Development Environment Setup',
                category: 'setup',
                difficulty: 'beginner',
                estimatedTime: 20,
                points: 40,
                description: 'Configure your development environment for AutoZone projects',
                objectives: [
                    'Set up Vertex AI configuration for Claude Code',
                    'Configure AutoZone GitLab integration',
                    'Install and configure required development tools',
                    'Verify connection to AutoZone development resources'
                ],
                instructions: [
                    'Configure Claude Code to use Vertex AI with AutoZone project settings',
                    'Set up GitLab credentials for AutoZone repositories',
                    'Install Node.js, Docker, and other required tools',
                    'Test connection to AutoZone development databases'
                ],
                hints: [
                    'Use the AutoZone-specific environment variables shown in the training',
                    'GitLab integration requires personal access tokens',
                    'Docker configuration should include AutoZone registry access'
                ],
                validationSteps: [
                    {
                        command: '/status',
                        expectedOutput: ['azsb-it-genai', 'us-east5', 'Connected'],
                        points: 20
                    },
                    {
                        userInput: 'configure gitlab integration',
                        expectedOutput: ['GitLab', 'configured', 'access'],
                        points: 20,
                        freeform: true
                    }
                ],
                successMessage: 'Excellent! Your AutoZone development environment is properly configured.',
                nextExercise: 'az-microservice-creation'
            },

            'az-microservice-creation': {
                id: 'az-microservice-creation',
                title: 'Create AutoZone Microservice',
                category: 'development',
                difficulty: 'intermediate',
                estimatedTime: 45,
                points: 80,
                description: 'Build a microservice following AutoZone architecture patterns',
                objectives: [
                    'Generate microservice boilerplate using AutoZone templates',
                    'Implement proper error handling and logging',
                    'Add health checks and monitoring endpoints',
                    'Configure Docker containerization',
                    'Set up automated testing pipeline'
                ],
                instructions: [
                    'Ask Claude Code to create a new inventory microservice',
                    'Request implementation of health check endpoints',
                    'Add Dockerfile and docker-compose configuration',
                    'Implement unit tests with Jest',
                    'Configure CI/CD pipeline for GitLab'
                ],
                hints: [
                    'Mention AutoZone patterns and standards in your requests',
                    'Include error handling and monitoring in requirements',
                    'Ask for Docker and testing setup in the same request'
                ],
                validationSteps: [
                    {
                        userInput: 'create inventory microservice following autozone patterns',
                        expectedOutput: ['microservice', 'inventory', 'TypeScript', 'Express'],
                        points: 20,
                        freeform: true
                    },
                    {
                        userInput: 'add health check endpoints',
                        expectedOutput: ['health', 'endpoint', 'monitoring'],
                        points: 20,
                        freeform: true
                    },
                    {
                        userInput: 'create dockerfile for deployment',
                        expectedOutput: ['Dockerfile', 'Docker', 'container'],
                        points: 20,
                        freeform: true
                    },
                    {
                        userInput: 'add unit tests with jest',
                        expectedOutput: ['test', 'Jest', 'unit'],
                        points: 20,
                        freeform: true
                    }
                ],
                successMessage: 'Outstanding! You\'ve created a production-ready microservice following AutoZone standards.',
                nextExercise: 'az-mobile-feature'
            },

            'az-mobile-feature': {
                id: 'az-mobile-feature',
                title: 'AutoZone Mobile App Feature',
                category: 'mobile',
                difficulty: 'advanced',
                estimatedTime: 60,
                points: 100,
                description: 'Implement a mobile feature for the AutoZone app',
                objectives: [
                    'Create barcode scanning functionality',
                    'Implement product lookup and display',
                    'Add shopping cart integration',
                    'Handle offline scenarios',
                    'Ensure accessibility compliance'
                ],
                instructions: [
                    'Request a React Native barcode scanner component',
                    'Ask for product lookup API integration',
                    'Implement shopping cart functionality',
                    'Add offline support with local storage',
                    'Request accessibility features'
                ],
                hints: [
                    'Mention React Native and AutoZone mobile patterns',
                    'Include camera permissions and error handling',
                    'Ask for offline functionality and accessibility together'
                ],
                validationSteps: [
                    {
                        userInput: 'create react native barcode scanner component',
                        expectedOutput: ['React Native', 'barcode', 'scanner', 'camera'],
                        points: 25,
                        freeform: true
                    },
                    {
                        userInput: 'implement product lookup with api integration',
                        expectedOutput: ['product', 'lookup', 'API', 'integration'],
                        points: 25,
                        freeform: true
                    },
                    {
                        userInput: 'add shopping cart functionality',
                        expectedOutput: ['shopping', 'cart', 'Redux', 'state'],
                        points: 25,
                        freeform: true
                    },
                    {
                        userInput: 'implement offline support',
                        expectedOutput: ['offline', 'storage', 'sync'],
                        points: 25,
                        freeform: true
                    }
                ],
                successMessage: 'Impressive! You\'ve built a complete mobile feature with professional-grade functionality.',
                nextExercise: 'az-performance-optimization'
            },

            'az-performance-optimization': {
                id: 'az-performance-optimization',
                title: 'AutoZone Application Performance Optimization',
                category: 'performance',
                difficulty: 'advanced',
                estimatedTime: 40,
                points: 90,
                description: 'Optimize performance of AutoZone web applications',
                objectives: [
                    'Analyze performance bottlenecks',
                    'Implement caching strategies',
                    'Optimize database queries',
                    'Add performance monitoring',
                    'Improve frontend loading times'
                ],
                instructions: [
                    'Request performance analysis of a web application',
                    'Ask for caching implementation strategies',
                    'Get recommendations for database optimization',
                    'Request performance monitoring setup',
                    'Ask for frontend optimization techniques'
                ],
                hints: [
                    'Mention specific performance metrics and targets',
                    'Ask for both backend and frontend optimizations',
                    'Include monitoring and measurement in requests'
                ],
                validationSteps: [
                    {
                        userInput: 'analyze application performance bottlenecks',
                        expectedOutput: ['performance', 'analysis', 'bottlenecks'],
                        points: 18,
                        freeform: true
                    },
                    {
                        userInput: 'implement caching strategy',
                        expectedOutput: ['caching', 'Redis', 'strategy'],
                        points: 18,
                        freeform: true
                    },
                    {
                        userInput: 'optimize database queries',
                        expectedOutput: ['database', 'optimization', 'queries'],
                        points: 18,
                        freeform: true
                    },
                    {
                        userInput: 'add performance monitoring',
                        expectedOutput: ['monitoring', 'metrics', 'performance'],
                        points: 18,
                        freeform: true
                    },
                    {
                        userInput: 'optimize frontend loading times',
                        expectedOutput: ['frontend', 'optimization', 'loading'],
                        points: 18,
                        freeform: true
                    }
                ],
                successMessage: 'Excellent work! You\'ve demonstrated expertise in performance optimization.',
                nextExercise: null
            }
        };

        // Add exercises to the exercise engine
        Object.assign(this.exerciseEngine.exercises, autoZoneExercises);
    }

    /**
     * Get a specific scenario
     */
    getScenario(scenarioId) {
        return this.scenarios[scenarioId];
    }

    /**
     * Get all scenarios
     */
    getAllScenarios() {
        return this.scenarios;
    }

    /**
     * Get scenarios by difficulty
     */
    getScenariosByDifficulty(difficulty) {
        return Object.values(this.scenarios).filter(scenario => 
            scenario.difficulty === difficulty
        );
    }

    /**
     * Get scenarios by domain
     */
    getScenariosByDomain(domain) {
        return Object.values(this.scenarios).filter(scenario => 
            scenario.domain === domain
        );
    }

    /**
     * Get real-world example
     */
    getRealWorldExample(exampleId) {
        return this.realWorldExamples[exampleId];
    }

    /**
     * Get code template
     */
    getCodeTemplate(templateId) {
        return this.codeTemplates[templateId];
    }

    /**
     * Generate code from template
     */
    generateFromTemplate(templateId, replacements) {
        const template = this.codeTemplates[templateId];
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        let generatedCode = template.template;
        
        // Replace placeholders with actual values
        Object.entries(replacements).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}}`, 'g');
            generatedCode = generatedCode.replace(regex, value);
        });

        return {
            language: template.language,
            code: generatedCode
        };
    }

    /**
     * Get scenario-based recommendations
     */
    getRecommendations(userLevel, interests = []) {
        const scenarios = Object.values(this.scenarios);
        
        // Filter by difficulty based on user level
        let filteredScenarios = scenarios;
        if (userLevel === 'beginner') {
            filteredScenarios = scenarios.filter(s => 
                s.difficulty === 'beginner' || s.difficulty === 'intermediate'
            );
        } else if (userLevel === 'intermediate') {
            filteredScenarios = scenarios.filter(s => 
                s.difficulty === 'intermediate' || s.difficulty === 'advanced'
            );
        }

        // Further filter by interests if provided
        if (interests.length > 0) {
            filteredScenarios = filteredScenarios.filter(scenario =>
                interests.some(interest => 
                    scenario.domain === interest || 
                    scenario.technologies.some(tech => 
                        tech.toLowerCase().includes(interest.toLowerCase())
                    )
                )
            );
        }

        return filteredScenarios.slice(0, 3); // Return top 3 recommendations
    }

    /**
     * Get learning path
     */
    getLearningPath(targetRole) {
        const paths = {
            'backend-developer': [
                'microservice-setup',
                'legacy-integration',
                'data-pipeline',
                'security-audit'
            ],
            'frontend-developer': [
                'mobile-app-feature',
                'performance-optimization',
                'microservice-setup'
            ],
            'full-stack-developer': [
                'microservice-setup',
                'mobile-app-feature',
                'legacy-integration',
                'performance-optimization'
            ],
            'devops-engineer': [
                'microservice-setup',
                'data-pipeline',
                'performance-optimization',
                'security-audit'
            ]
        };

        const pathIds = paths[targetRole] || paths['full-stack-developer'];
        return pathIds.map(id => this.scenarios[id]).filter(Boolean);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoZoneScenarios;
} else {
    window.AutoZoneScenarios = AutoZoneScenarios;
}