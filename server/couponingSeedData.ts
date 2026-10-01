import { Deal } from '../src/types';

export const krazyCouponLadyDeals: Deal[] = [
  // 1. CVS Moneymaker: Colgate Optic White Toothpaste
  {
    id: 'kcl-cvs-colgate-moneymaker',
    title: 'Colgate Optic White Renewal Toothpaste (Buy 2 at CVS)',
    description: 'Stack CVS weekly sale $3.99 + $4.00/2 digital manufacturer coupon + $4.00 ExtraBucks Rewards for a $0.02 MONEYMAKER!',
    storeId: 'store-cvs',
    storeName: 'CVS Pharmacy',
    storeLogo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'cvs.com',
    dealType: 'coupon_code',
    discountDisplay: 'FREE + $0.02 MONEYMAKER',
    category: 'Personal Care & Beauty',
    subcategory: 'Oral Care',
    targetUrl: 'https://www.cvs.com',
    directMerchantUrl: 'https://www.cvs.com',
    isAffiliateLink: false,
    channel: 'IN_STORE_ONLY',
    geoAvailabilityText: 'Available at all US CVS Pharmacy locations nationwide',
    country: 'US',
    currency: 'USD',
    freeClassification: '$0_FREE',
    originalPrice: 9.98,
    currentPrice: 7.98,
    outOfPocketPrice: 3.98,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 9.98,
    estimatedSavingsPercent: 100,
    isMoneyMaker: true,
    moneyMakerAmount: 0.02,
    dealScore: 99,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 99,
    productName: 'Colgate Optic White Renewal Toothpaste 3 oz (2-Pack)',
    productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    tags: ['Moneymaker', 'The Krazy Coupon Lady', 'CVS ExtraBucks', 'Oral Care', 'Freebie'],
    createdAt: new Date().toISOString(),
    popularityCount: 1420,
    howToGetSteps: [
      'Open the CVS ExtraCare App and clip the $4.00/2 Colgate digital manufacturer coupon',
      'Head to CVS and pick up 2 tubes of Colgate Optic White on sale for $3.99 each (Subtotal: $7.98)',
      'Scan your ExtraCare card or enter phone number at checkout. The $4.00 coupon deducts immediately',
      'Pay $3.98 out of pocket (+ tax). Your register receipt will print $4.00 in ExtraBucks Rewards',
      'Net result: Both tubes are 100% FREE + $0.02 Moneymaker for your next shopping trip!'
    ],
    savingsRecipe: {
      whatToBuy: 'Buy 2 Colgate Optic White Renewal Toothpastes 3 oz',
      quantityRequired: 2,
      regularUnitPrice: 4.99,
      regularTotalPrice: 9.98,
      saleUnitPrice: 3.99,
      saleTotalPrice: 7.98,
      salePromotionType: 'SALE_PRICE',
      coupons: [
        {
          title: '$4.00/2 Colgate Dental Care Digital Manufacturer Coupon',
          type: 'MANUFACTURER',
          discountAmount: 4.00,
          clipRequired: true,
          source: 'CVS App Send-to-Card',
          restrictions: 'Limit 1 coupon per ExtraCare card'
        }
      ],
      totalCouponsDiscount: 4.00,
      outOfPocketToday: 3.98,
      rewardsEarned: [
        {
          name: '$4.00 ExtraBucks Rewards',
          type: 'EXTRABUCKS',
          amount: 4.00,
          timing: 'IMMEDIATE_AT_CHECKOUT',
          rollingAllowed: true,
          description: 'Prints on receipt immediately; roll into your next CVS purchase!'
        }
      ],
      totalRewardsEarned: 4.00,
      cashbackRebates: [],
      totalCashbackRebates: 0,
      effectiveNetCost: -0.02,
      effectiveNetPerUnit: -0.01,
      isMoneyMaker: true,
      moneyMakerAmount: 0.02,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Clip the $4.00/2 Colgate coupon in your CVS ExtraCare mobile app' },
        { stepNumber: 2, instruction: 'Add 2 Colgate Optic White toothpastes to your cart ($3.99 sale price each)' },
        { stepNumber: 3, instruction: 'Enter phone number at checkout: pay $3.98 out of pocket' },
        { stepNumber: 4, instruction: 'Receive $4.00 ExtraBucks Rewards printed on your receipt' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / CVS ExtraCare Weekly Circular',
      confidenceScore: 99,
      userConfirmations: 248,
      userFailureReports: 0
    },
    expiration: {
      label: 'Active through Saturday',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 98
    }
  },

  // 2. Target Circle Laundry Stack: Tide Pods + Downy + Bounce
  {
    id: 'kcl-target-tide-laundry-stack',
    title: 'Tide Pods 42 ct + Downy Fabric Softener + Bounce Sheets',
    description: 'Target Circle "Spend $50 Get $15 Gift Card" stack with $3.00 manufacturer coupon, $3.00 P&G digital, and $4.00 Ibotta cashback.',
    storeId: 'store-target',
    storeName: 'Target',
    storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'target.com',
    dealType: 'coupon_stack',
    discountDisplay: '62% OFF ($5.65 each)',
    category: 'Household & Cleaning',
    subcategory: 'Laundry Care',
    targetUrl: 'https://www.target.com',
    directMerchantUrl: 'https://www.target.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Nationwide at Target stores and Order Pickup',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 53.96,
    currentPrice: 51.96,
    outOfPocketPrice: 41.96,
    estimatedFinalPrice: 22.96,
    estimatedSavingsDollar: 31.00,
    estimatedSavingsPercent: 57.5,
    isMoneyMaker: false,
    dealScore: 97,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    productName: 'P&G Mega Laundry Bundle: 2x Tide Pods 42ct + Downy + Bounce 240ct',
    productImage: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=500&q=80',
    tags: ['Target Circle', 'The Krazy Coupon Lady', 'Laundry Stack', 'Ibotta Rebate', 'Gift Card Deal'],
    createdAt: new Date().toISOString(),
    popularityCount: 1890,
    howToGetSteps: [
      'Save the "Spend $50 on Household Essentials, Get $15 Target Gift Card" offer in your Target Circle app',
      'Clip the $3.00/1 Tide Pods digital coupon and $3.00/1 Downy digital coupon in Target Circle',
      'Add qualifying items totaling over $50 to your cart (or scan barcode at register / Order Pickup)',
      'Coupons will deduct $10.00 at register. Pay $41.96 and receive your $15.00 Target Gift Card instantly',
      'Upload receipt photo to Ibotta app to get $4.00 cashback deposited directly to PayPal/Bank',
      'Net cost: $22.96 for over $53 worth of premium laundry care ($5.74 per large item)!'
    ],
    savingsRecipe: {
      whatToBuy: '2x Tide Pods (42 ct) + 1x Downy Liquid Softener + 1x Bounce Dryer Sheets (240 ct)',
      quantityRequired: 4,
      regularUnitPrice: 13.49,
      regularTotalPrice: 53.96,
      saleUnitPrice: 12.99,
      saleTotalPrice: 51.96,
      salePromotionType: 'SPEND_GET',
      coupons: [
        {
          title: '$3.00/1 Tide Pods Target Circle Digital Coupon',
          type: 'DIGITAL',
          discountAmount: 3.00,
          clipRequired: true,
          source: 'Target Circle App'
        },
        {
          title: '$3.00/1 Downy Fabric Conditioners Digital Coupon',
          type: 'DIGITAL',
          discountAmount: 3.00,
          clipRequired: true,
          source: 'Target Circle App'
        },
        {
          title: '$4.00/2 P&G Household Products Bonus Clip',
          type: 'MANUFACTURER',
          discountAmount: 4.00,
          clipRequired: true,
          source: 'Target Circle Manufacturer Deal'
        }
      ],
      totalCouponsDiscount: 10.00,
      outOfPocketToday: 41.96,
      rewardsEarned: [
        {
          name: '$15.00 Target Gift Card',
          type: 'TARGET_GIFT_CARD',
          amount: 15.00,
          timing: 'IMMEDIATE_AT_CHECKOUT',
          rollingAllowed: true,
          description: 'Gift card automatically adds to your Target Wallet or physical card'
        }
      ],
      totalRewardsEarned: 15.00,
      cashbackRebates: [
        {
          provider: 'Ibotta',
          amount: 4.00,
          type: 'REBATE',
          submissionRequirement: 'Submit paper receipt or linked Target account in Ibotta',
          verificationStatus: 'CONFIRMED'
        }
      ],
      totalCashbackRebates: 4.00,
      effectiveNetCost: 22.96,
      effectiveNetPerUnit: 5.74,
      isMoneyMaker: false,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Save the $15 Gift Card offer and $10 in coupons in your Target Circle app' },
        { stepNumber: 2, instruction: 'Purchase 4 qualifying laundry items totaling $51.96' },
        { stepNumber: 3, instruction: 'Scan Circle barcode at register. Pay $41.96 and receive $15 Target Gift Card' },
        { stepNumber: 4, instruction: 'Submit receipt to Ibotta for $4.00 cash back. Net total: $22.96 ($5.74 each)' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / Target Circle Weekly Ad',
      confidenceScore: 98,
      userConfirmations: 312,
      userFailureReports: 1
    },
    expiration: {
      label: 'Active through Saturday',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 96
    }
  },

  // 3. Walgreens Moneymaker: Crest 3D White & Oral-B Floss
  {
    id: 'kcl-walgreens-crest-moneymaker',
    title: 'Crest 3D White Toothpaste & Oral-B Glide Floss Picks (Buy 2)',
    description: 'Sale $4.00 each at Walgreens. Clip $4.00/2 digital manufacturer coupon in app, pay $4.00, and earn $4.00 in Register Rewards = 100% FREE!',
    storeId: 'store-walgreens',
    storeName: 'Walgreens',
    storeLogo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'walgreens.com',
    dealType: 'coupon_stack',
    discountDisplay: '100% FREE ($0.00)',
    category: 'Personal Care & Beauty',
    subcategory: 'Oral Care',
    targetUrl: 'https://www.walgreens.com',
    directMerchantUrl: 'https://www.walgreens.com',
    isAffiliateLink: false,
    channel: 'IN_STORE_ONLY',
    geoAvailabilityText: 'Nationwide at all participating Walgreens locations',
    country: 'US',
    currency: 'USD',
    freeClassification: '$0_FREE',
    originalPrice: 9.58,
    currentPrice: 8.00,
    outOfPocketPrice: 4.00,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 9.58,
    estimatedSavingsPercent: 100,
    isMoneyMaker: true,
    moneyMakerAmount: 0.00,
    dealScore: 98,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 99,
    productName: 'Crest 3D White Stain Eraser + Oral-B Glide Scope Floss Picks',
    productImage: 'https://images.unsplash.com/photo-1559671077-802c2e008f58?auto=format&fit=crop&w=500&q=80',
    tags: ['Freebie', 'The Krazy Coupon Lady', 'Walgreens Register Rewards', 'Oral Care'],
    createdAt: new Date().toISOString(),
    popularityCount: 1105,
    howToGetSteps: [
      'Log into the myWalgreens app and clip the "$4.00/2 Crest & Oral-B" digital coupon to your account',
      'Pick up 1 Crest 3D White Toothpaste and 1 Oral-B Glide Floss Pack on sale for $4.00 each ($8.00 total)',
      'Enter your phone number at register. The $4.00 digital coupon automatically applies',
      'Pay $4.00 out of pocket (+ tax). A $4.00 Register Reward catalina coupon prints instantly at checkout',
      'Final cost: Completely FREE after rewards!'
    ],
    savingsRecipe: {
      whatToBuy: '1 Crest 3D White Toothpaste + 1 Oral-B Glide Floss Picks',
      quantityRequired: 2,
      regularUnitPrice: 4.79,
      regularTotalPrice: 9.58,
      saleUnitPrice: 4.00,
      saleTotalPrice: 8.00,
      salePromotionType: 'BUY_GET',
      coupons: [
        {
          title: '$4.00/2 Crest or Oral-B Dental Products Digital Coupon',
          type: 'MANUFACTURER',
          discountAmount: 4.00,
          clipRequired: true,
          source: 'myWalgreens App Clip'
        }
      ],
      totalCouponsDiscount: 4.00,
      outOfPocketToday: 4.00,
      rewardsEarned: [
        {
          name: '$4.00 Register Rewards Catalina',
          type: 'WALGREENS_CASH',
          amount: 4.00,
          timing: 'IMMEDIATE_AT_CHECKOUT',
          rollingAllowed: true,
          description: 'Prints at checkout; use like cash on your next Walgreens purchase!'
        }
      ],
      totalRewardsEarned: 4.00,
      cashbackRebates: [],
      totalCashbackRebates: 0,
      effectiveNetCost: 0.00,
      effectiveNetPerUnit: 0.00,
      isMoneyMaker: true,
      moneyMakerAmount: 0.00,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Clip the $4.00/2 coupon in the myWalgreens app' },
        { stepNumber: 2, instruction: 'Grab 2 qualifying items priced at $4.00 each ($8.00 total)' },
        { stepNumber: 3, instruction: 'Scan loyalty barcode: pay $4.00 and get $4.00 Register Rewards' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / myWalgreens Weekly Ad',
      confidenceScore: 99,
      userConfirmations: 198,
      userFailureReports: 0
    },
    expiration: {
      label: 'Active through Saturday',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 97
    }
  },

  // 4. Target Moneymaker: CoverGirl Eye Cosmetics + Ibotta
  {
    id: 'kcl-target-covergirl-moneymaker',
    title: 'CoverGirl Eye Enhancers 4-Kit Eyeshadow at Target',
    description: 'Target shelf price $4.49. Clip $3.00/1 Target Circle digital manufacturer coupon, pay $1.49, submit to Ibotta for $1.50 cash back = $0.01 MONEYMAKER!',
    storeId: 'store-target',
    storeName: 'Target',
    storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'target.com',
    dealType: 'coupon_stack',
    discountDisplay: 'FREE + $0.01 MONEYMAKER',
    category: 'Personal Care & Beauty',
    subcategory: 'Cosmetics',
    targetUrl: 'https://www.target.com',
    directMerchantUrl: 'https://www.target.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Target stores nationwide and Drive Up orders',
    country: 'US',
    currency: 'USD',
    freeClassification: '$0_FREE',
    originalPrice: 4.49,
    currentPrice: 4.49,
    outOfPocketPrice: 1.49,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 4.50,
    estimatedSavingsPercent: 100,
    isMoneyMaker: true,
    moneyMakerAmount: 0.01,
    dealScore: 98,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 99,
    productName: 'CoverGirl Eye Enhancers 4-Kit Eyeshadow Palette',
    productImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80',
    tags: ['Moneymaker', 'The Krazy Coupon Lady', 'Target Circle', 'Ibotta', 'Makeup'],
    createdAt: new Date().toISOString(),
    popularityCount: 970,
    howToGetSteps: [
      'In the Target Circle app, save the "$3.00/1 CoverGirl Eye Product" manufacturer coupon',
      'In the Ibotta app, activate the "$1.50/1 CoverGirl Eye Product" cash back rebate',
      'Buy 1 CoverGirl Eye Enhancers 4-Kit Eyeshadow at Target for $4.49 regular price',
      'Scan your Target Circle barcode at the register. Pay $1.49 out of pocket',
      'Scan your printed receipt in the Ibotta app to receive $1.50 cash back immediately',
      'Final cost: Completely FREE plus a $0.01 Moneymaker!'
    ],
    savingsRecipe: {
      whatToBuy: '1 CoverGirl Eye Enhancers 4-Kit Eyeshadow Palette',
      quantityRequired: 1,
      regularUnitPrice: 4.49,
      regularTotalPrice: 4.49,
      saleUnitPrice: 4.49,
      saleTotalPrice: 4.49,
      salePromotionType: 'STANDARD',
      coupons: [
        {
          title: '$3.00/1 CoverGirl Eye Product Target Circle Manufacturer Coupon',
          type: 'MANUFACTURER',
          discountAmount: 3.00,
          clipRequired: true,
          source: 'Target Circle App Clip'
        }
      ],
      totalCouponsDiscount: 3.00,
      outOfPocketToday: 1.49,
      rewardsEarned: [],
      totalRewardsEarned: 0,
      cashbackRebates: [
        {
          provider: 'Ibotta',
          amount: 1.50,
          type: 'REBATE',
          submissionRequirement: 'Scan receipt into Ibotta within 7 days',
          verificationStatus: 'CONFIRMED'
        }
      ],
      totalCashbackRebates: 1.50,
      effectiveNetCost: -0.01,
      effectiveNetPerUnit: -0.01,
      isMoneyMaker: true,
      moneyMakerAmount: 0.01,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Clip the $3.00 Target Circle coupon and activate $1.50 Ibotta offer' },
        { stepNumber: 2, instruction: 'Buy 1 CoverGirl 4-Kit palette for $4.49' },
        { stepNumber: 3, instruction: 'Pay $1.49 at checkout, then claim $1.50 from Ibotta = FREE + $0.01 Moneymaker' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / Target Circle & Ibotta Stack',
      confidenceScore: 99,
      userConfirmations: 165,
      userFailureReports: 0
    },
    expiration: {
      label: 'Verified active this week',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 98
    }
  },

  // 5. Amazon Koupons.ai Double Stack: 50% Promo Code + 20% Clip Coupon
  {
    id: 'koupons-amazon-sonic-toothbrush',
    title: 'High-Speed Sonic Electric Toothbrush with 8 Brush Heads (Amazon)',
    description: 'Koupons.ai exclusive stack: Clip 20% coupon on Amazon product page, then apply 50% promo code 50SONIC at checkout. Drops from $49.99 to $14.99!',
    storeId: 'store-amazon',
    storeName: 'Amazon',
    storeLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'amazon.com',
    code: '50SONIC',
    dealType: 'coupon_code',
    discountDisplay: '70% OFF ($14.99)',
    category: 'Amazon Promo Codes',
    subcategory: 'Personal Care Electronics',
    targetUrl: 'https://www.amazon.com',
    directMerchantUrl: 'https://www.amazon.com',
    isAffiliateLink: false,
    channel: 'ONLINE_ONLY',
    geoAvailabilityText: 'Shipped by Amazon Prime nationwide with free 2-day delivery',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 49.99,
    currentPrice: 39.99,
    outOfPocketPrice: 14.99,
    estimatedFinalPrice: 14.99,
    estimatedSavingsDollar: 35.00,
    estimatedSavingsPercent: 70,
    isMoneyMaker: false,
    dealScore: 96,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 97,
    productName: 'Sonic Electric Rechargeable Toothbrush 40,000 VPM + Travel Case',
    productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    tags: ['Koupons.ai', 'Amazon Promo Code', 'Glitch / Stack', 'Clip Coupon', 'Electronics'],
    createdAt: new Date().toISOString(),
    popularityCount: 2310,
    howToGetSteps: [
      'Go to the Amazon product page and check the "Clip 20% Coupon" checkbox underneath the price',
      'Add the item to your Amazon cart and proceed to final checkout',
      'In the "Add a gift card or promotion code or voucher" field, enter promo code 50SONIC',
      'Both the 20% clip coupon (-$10.00) and the 50% promo code (-$25.00) will stack simultaneously',
      'Final checkout price drops from $49.99 to just $14.99 with free Prime shipping!'
    ],
    savingsRecipe: {
      whatToBuy: '1 Sonic Electric Rechargeable Toothbrush with 8 Brush Heads',
      quantityRequired: 1,
      regularUnitPrice: 49.99,
      regularTotalPrice: 49.99,
      saleUnitPrice: 49.99,
      saleTotalPrice: 49.99,
      salePromotionType: 'STANDARD',
      coupons: [
        {
          title: '50% Off Promo Code 50SONIC',
          type: 'APP_ONLY',
          discountAmount: 25.00,
          code: '50SONIC',
          clipRequired: false,
          source: 'Koupons.ai Exclusive Promo Code'
        },
        {
          title: '20% Off Amazon Clip Coupon',
          type: 'DIGITAL',
          discountAmount: 10.00,
          clipRequired: true,
          source: 'Amazon On-Page Clip Coupon'
        }
      ],
      totalCouponsDiscount: 35.00,
      outOfPocketToday: 14.99,
      rewardsEarned: [],
      totalRewardsEarned: 0,
      cashbackRebates: [],
      totalCashbackRebates: 0,
      effectiveNetCost: 14.99,
      effectiveNetPerUnit: 14.99,
      isMoneyMaker: false,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Check the 20% Clip Coupon on the Amazon listing' },
        { stepNumber: 2, instruction: 'Apply promo code 50SONIC at Amazon checkout' },
        { stepNumber: 3, instruction: 'Verify double discount: price drops from $49.99 to $14.99' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'automated_checkout_probe',
      source: 'Koupons.ai Verified Promo Code Feed',
      confidenceScore: 97,
      userConfirmations: 432,
      userFailureReports: 3
    },
    expiration: {
      label: 'Promo code active while supplies last',
      isExpiringSoon: true,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 92
    }
  },

  // 6. Dollar General Saturday $5 off $25 Scenario
  {
    id: 'kcl-dg-saturday-5off25-scenario',
    title: 'Dollar General Saturday $5 off $25 Scenario: Gain, Febreze, Scott',
    description: 'Iconic Krazy Coupon Lady Saturday scenario: Stack Dollar General $5 off $25 store coupon with Gain $2.00, Febreze BOGO $3.30, and Scott $1.00 digital coupons. $25.50 worth of essentials for only $14.20!',
    storeId: 'store-dollargeneral',
    storeName: 'Dollar General',
    storeLogo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'dollargeneral.com',
    dealType: 'coupon_stack',
    discountDisplay: '44% OFF ($14.20 Out of Pocket)',
    category: 'Household & Cleaning',
    subcategory: 'Weekly Stacks',
    targetUrl: 'https://www.dollargeneral.com',
    directMerchantUrl: 'https://www.dollargeneral.com',
    isAffiliateLink: false,
    channel: 'IN_STORE_ONLY',
    geoAvailabilityText: 'At all 19,000+ Dollar General stores on Saturday',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 25.50,
    currentPrice: 25.50,
    outOfPocketPrice: 14.20,
    estimatedFinalPrice: 14.20,
    estimatedSavingsDollar: 11.30,
    estimatedSavingsPercent: 44.3,
    isMoneyMaker: false,
    dealScore: 95,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    productName: 'Gain Flings + Febreze Air Effects + Scott Paper Towels 6pk + Mr. Clean',
    productImage: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80',
    tags: ['The Krazy Coupon Lady', 'Dollar General', '$5 off $25 Scenario', 'Household Stacking'],
    createdAt: new Date().toISOString(),
    popularityCount: 1640,
    howToGetSteps: [
      'In the Dollar General App, clip the "$5 off $25 Saturday Only" digital store coupon',
      'Clip the manufacturer coupons: $2.00 Gain, $3.30/2 Febreze BOGO, and $1.00 Scott Paper Towels',
      'Head to DG on Saturday and grab: 1 Gain Flings ($7.50), 2 Febreze Air ($6.50), 1 Scott Towels 6pk ($6.00), 1 Mr. Clean ($5.50). Total = $25.50',
      'Type your phone number into the pin pad at the register BEFORE the cashier finishes scanning',
      'Watch all $11.30 in coupons deduct automatically. Pay only $14.20 for everything!'
    ],
    savingsRecipe: {
      whatToBuy: '1 Gain Flings + 2 Febreze Air + 1 Scott Paper Towels 6-Roll + 1 Mr. Clean Clean Freak',
      quantityRequired: 5,
      regularUnitPrice: 5.10,
      regularTotalPrice: 25.50,
      saleUnitPrice: 5.10,
      saleTotalPrice: 25.50,
      salePromotionType: 'SPEND_GET',
      coupons: [
        {
          title: '$5.00 off $25 Saturday DG Store Digital Coupon',
          type: 'STORE_COUPON',
          discountAmount: 5.00,
          clipRequired: true,
          source: 'DG App Digital Coupons'
        },
        {
          title: '$2.00/1 Gain Liquid Detergent or Flings Digital Coupon',
          type: 'MANUFACTURER',
          discountAmount: 2.00,
          clipRequired: true,
          source: 'DG App Manufacturer Coupon'
        },
        {
          title: '$3.30/2 Febreze Air Effects BOGO Digital Coupon',
          type: 'MANUFACTURER',
          discountAmount: 3.30,
          clipRequired: true,
          source: 'DG App Manufacturer Coupon'
        },
        {
          title: '$1.00/1 Scott Paper Towels Digital Coupon',
          type: 'MANUFACTURER',
          discountAmount: 1.00,
          clipRequired: true,
          source: 'DG App Manufacturer Coupon'
        }
      ],
      totalCouponsDiscount: 11.30,
      outOfPocketToday: 14.20,
      rewardsEarned: [],
      totalRewardsEarned: 0,
      cashbackRebates: [],
      totalCashbackRebates: 0,
      effectiveNetCost: 14.20,
      effectiveNetPerUnit: 2.84,
      isMoneyMaker: false,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Clip the $5/$25 coupon and all 3 manufacturer coupons in DG app' },
        { stepNumber: 2, instruction: 'Shop on Saturday and hit at least $25.00 subtotal' },
        { stepNumber: 3, instruction: 'Enter phone number at pin pad: pay $14.20 out of pocket (save $11.30)' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'community_consensus',
      source: 'The Krazy Coupon Lady Saturday DG Matchup Guide',
      confidenceScore: 98,
      userConfirmations: 284,
      userFailureReports: 2
    },
    expiration: {
      label: 'Saturday Only (Valid all day Saturday)',
      isExpiringSoon: true,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 99
    }
  },

  // 7. Target Baby / Diapers Stack: Huggies Super Packs
  {
    id: 'kcl-target-huggies-diapers-stack',
    title: 'Huggies Little Snugglers Diapers Super Pack (Buy 2 at Target)',
    description: 'Buy 2 Super Packs at $28.49 each ($56.98 total). Earn a $15.00 Target Gift Card, clip $3.00 Target Circle manufacturer coupon, and submit $3.00 to Ibotta = $17.99 each (37% savings)!',
    storeId: 'store-target',
    storeName: 'Target',
    storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'target.com',
    dealType: 'coupon_stack',
    discountDisplay: '$17.99 / Box (Save $21.00)',
    category: 'Baby & Diapers',
    subcategory: 'Diapers & Wipes',
    targetUrl: 'https://www.target.com',
    directMerchantUrl: 'https://www.target.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Nationwide at Target and Target Order Pickup',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 56.98,
    currentPrice: 56.98,
    outOfPocketPrice: 53.98,
    estimatedFinalPrice: 35.98,
    estimatedSavingsDollar: 21.00,
    estimatedSavingsPercent: 36.9,
    isMoneyMaker: false,
    dealScore: 94,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    productName: 'Huggies Little Snugglers Baby Diapers Super Pack (Size 1-6)',
    productImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80',
    tags: ['The Krazy Coupon Lady', 'Target Circle', 'Diapers', 'Baby Deals', 'Gift Card Stack'],
    createdAt: new Date().toISOString(),
    popularityCount: 1512,
    howToGetSteps: [
      'Save the "Buy 2 select Enormous/Super Pack Diapers, Get $15 Target Gift Card" offer in Target Circle',
      'Clip the $3.00/1 Huggies Diapers digital manufacturer coupon in Target Circle',
      'Buy 2 Super Packs of Huggies Little Snugglers priced at $28.49 each ($56.98 total)',
      'Scan Target Circle at register: coupon deducts $3.00, pay $53.98 out of pocket and get $15 Gift Card',
      'Submit receipt to Ibotta for $3.00 cash back ($1.50 per box)',
      'Net price: $35.98 for both boxes ($17.99 each instead of $28.49)!'
    ],
    savingsRecipe: {
      whatToBuy: '2 Huggies Little Snugglers Super Pack Diaper Boxes',
      quantityRequired: 2,
      regularUnitPrice: 28.49,
      regularTotalPrice: 56.98,
      saleUnitPrice: 28.49,
      saleTotalPrice: 56.98,
      salePromotionType: 'BUY_GET',
      coupons: [
        {
          title: '$3.00/1 Huggies Diapers Target Circle Manufacturer Coupon',
          type: 'MANUFACTURER',
          discountAmount: 3.00,
          clipRequired: true,
          source: 'Target Circle App'
        }
      ],
      totalCouponsDiscount: 3.00,
      outOfPocketToday: 53.98,
      rewardsEarned: [
        {
          name: '$15.00 Target Gift Card',
          type: 'TARGET_GIFT_CARD',
          amount: 15.00,
          timing: 'IMMEDIATE_AT_CHECKOUT',
          rollingAllowed: true
        }
      ],
      totalRewardsEarned: 15.00,
      cashbackRebates: [
        {
          provider: 'Ibotta',
          amount: 3.00,
          type: 'REBATE',
          submissionRequirement: 'Submit paper receipt or linked Target account to Ibotta',
          verificationStatus: 'CONFIRMED'
        }
      ],
      totalCashbackRebates: 3.00,
      effectiveNetCost: 35.98,
      effectiveNetPerUnit: 17.99,
      isMoneyMaker: false,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Save $15 Gift Card offer + $3 coupon in Target Circle app' },
        { stepNumber: 2, instruction: 'Buy 2 Super Packs ($56.98 total)' },
        { stepNumber: 3, instruction: 'Pay $53.98, receive $15 Target Gift Card + $3.00 Ibotta rebate = $17.99 each' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / Target Weekly Circular',
      confidenceScore: 98,
      userConfirmations: 204,
      userFailureReports: 0
    },
    expiration: {
      label: 'Active through Saturday',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 96
    }
  },

  // 8. Walmart Rollback + Ibotta: Air Wick Scented Oil Warmer
  {
    id: 'kcl-walmart-airwick-moneymaker',
    title: 'Air Wick Advanced Scented Oil Warmer Unit at Walmart',
    description: 'Walmart rollback price $3.98. Clip $2.00/1 Walmart manufacturer digital coupon in Walmart app, submit receipt to Ibotta for $2.50 cash back = $0.52 MONEYMAKER!',
    storeId: 'store-walmart',
    storeName: 'Walmart',
    storeLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'walmart.com',
    dealType: 'coupon_stack',
    discountDisplay: 'FREE + $0.52 MONEYMAKER',
    category: 'Household & Cleaning',
    subcategory: 'Air Fresheners',
    targetUrl: 'https://www.walmart.com',
    directMerchantUrl: 'https://www.walmart.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Walmart stores nationwide & Walmart Pickup',
    country: 'US',
    currency: 'USD',
    freeClassification: '$0_FREE',
    originalPrice: 4.48,
    currentPrice: 3.98,
    outOfPocketPrice: 1.98,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 4.50,
    estimatedSavingsPercent: 100,
    isMoneyMaker: true,
    moneyMakerAmount: 0.52,
    dealScore: 99,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 99,
    productName: 'Air Wick Advanced Scented Oil Plug In Warmer',
    productImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=500&q=80',
    tags: ['Moneymaker', 'The Krazy Coupon Lady', 'Walmart Rollback', 'Ibotta', 'Air Care'],
    createdAt: new Date().toISOString(),
    popularityCount: 1330,
    howToGetSteps: [
      'In the Walmart App, clip the $2.00/1 Air Wick digital manufacturer coupon',
      'In the Ibotta app, activate the $2.50 cash back offer for Air Wick Scented Oil Warmer',
      'Buy 1 Air Wick Warmer on rollback at Walmart for $3.98',
      'Scan Walmart Pay or paper receipt barcode to apply the $2.00 digital coupon. Pay $1.98 out of pocket',
      'Submit receipt to Ibotta for $2.50 cash back',
      'Final cost: Completely FREE plus a $0.52 Moneymaker!'
    ],
    savingsRecipe: {
      whatToBuy: '1 Air Wick Advanced Scented Oil Warmer Unit',
      quantityRequired: 1,
      regularUnitPrice: 4.48,
      regularTotalPrice: 4.48,
      saleUnitPrice: 3.98,
      saleTotalPrice: 3.98,
      salePromotionType: 'SALE_PRICE',
      coupons: [
        {
          title: '$2.00/1 Air Wick Warmer Manufacturer Coupon',
          type: 'MANUFACTURER',
          discountAmount: 2.00,
          clipRequired: true,
          source: 'Walmart App Manufacturer Offers'
        }
      ],
      totalCouponsDiscount: 2.00,
      outOfPocketToday: 1.98,
      rewardsEarned: [],
      totalRewardsEarned: 0,
      cashbackRebates: [
        {
          provider: 'Ibotta',
          amount: 2.50,
          type: 'REBATE',
          submissionRequirement: 'Scan Walmart receipt in Ibotta app within 7 days',
          verificationStatus: 'CONFIRMED'
        }
      ],
      totalCashbackRebates: 2.50,
      effectiveNetCost: -0.52,
      effectiveNetPerUnit: -0.52,
      isMoneyMaker: true,
      moneyMakerAmount: 0.52,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Clip $2.00 coupon in Walmart app and activate $2.50 in Ibotta' },
        { stepNumber: 2, instruction: 'Buy Air Wick Warmer on rollback for $3.98' },
        { stepNumber: 3, instruction: 'Pay $1.98 at register, receive $2.50 from Ibotta = FREE + $0.52 Moneymaker' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / Walmart & Ibotta Stack',
      confidenceScore: 99,
      userConfirmations: 265,
      userFailureReports: 0
    },
    expiration: {
      label: 'Verified active today',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 97
    }
  },

  // 9. Amazon Koupons.ai 60% Off Promo Code
  {
    id: 'koupons-amazon-cervical-pillow',
    title: 'Ergonomic Cervical Contour Memory Foam Neck Pillow (Amazon)',
    description: 'Koupons.ai verified 60% off promo code 60SLEEP drops this orthopedic neck contour pillow from $39.99 down to $15.99 at checkout!',
    storeId: 'store-amazon',
    storeName: 'Amazon',
    storeLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'amazon.com',
    code: '60SLEEP',
    dealType: 'coupon_code',
    discountDisplay: '60% OFF ($15.99)',
    category: 'Amazon Promo Codes',
    subcategory: 'Bedding & Home',
    targetUrl: 'https://www.amazon.com',
    directMerchantUrl: 'https://www.amazon.com',
    isAffiliateLink: false,
    channel: 'ONLINE_ONLY',
    geoAvailabilityText: 'Amazon Prime 2-Day Delivery nationwide',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 39.99,
    currentPrice: 39.99,
    outOfPocketPrice: 15.99,
    estimatedFinalPrice: 15.99,
    estimatedSavingsDollar: 24.00,
    estimatedSavingsPercent: 60,
    isMoneyMaker: false,
    dealScore: 95,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    productName: 'Cervical Ergonomic Memory Foam Pillow with Cooling Cover',
    productImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=500&q=80',
    tags: ['Koupons.ai', 'Amazon Promo Code', 'Home Deals', 'Promo Code'],
    createdAt: new Date().toISOString(),
    popularityCount: 1840,
    howToGetSteps: [
      'Add the Cervical Contour Pillow to your Amazon cart',
      'Proceed to checkout payment review page',
      'Under "Add a gift card or promotion code", enter promo code 60SLEEP',
      'Price instantly recalculates from $39.99 to $15.99',
      'Complete order with free Amazon Prime shipping'
    ],
    savingsRecipe: {
      whatToBuy: '1 Ergonomic Cervical Memory Foam Neck Pillow',
      quantityRequired: 1,
      regularUnitPrice: 39.99,
      regularTotalPrice: 39.99,
      saleUnitPrice: 39.99,
      saleTotalPrice: 39.99,
      salePromotionType: 'STANDARD',
      coupons: [
        {
          title: '60% Off Exclusive Amazon Promo Code 60SLEEP',
          type: 'APP_ONLY',
          discountAmount: 24.00,
          code: '60SLEEP',
          clipRequired: false,
          source: 'Koupons.ai Exclusive Feed'
        }
      ],
      totalCouponsDiscount: 24.00,
      outOfPocketToday: 15.99,
      rewardsEarned: [],
      totalRewardsEarned: 0,
      cashbackRebates: [],
      totalCashbackRebates: 0,
      effectiveNetCost: 15.99,
      effectiveNetPerUnit: 15.99,
      isMoneyMaker: false,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Add pillow to Amazon cart' },
        { stepNumber: 2, instruction: 'Enter promo code 60SLEEP at checkout' },
        { stepNumber: 3, instruction: 'Pay $15.99 with free Prime delivery' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'automated_checkout_probe',
      source: 'Koupons.ai Verified Feed',
      confidenceScore: 98,
      userConfirmations: 310,
      userFailureReports: 1
    },
    expiration: {
      label: 'Limited quantity promotional code',
      isExpiringSoon: true,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 94
    }
  },

  // 10. CVS BOGO 50% + Manufacturer Coupon + Ibotta: Dove Body Wash
  {
    id: 'kcl-cvs-dove-bodywash-stack',
    title: 'Dove Deep Moisture Body Wash (Buy 2 at CVS)',
    description: 'CVS weekly promotion: Buy 1 Get 1 50% off ($9.49 reg price). Clip $4.00/2 Dove digital coupon in CVS app, get $2.00 ExtraBucks, submit $2.00 to Ibotta = $3.11 each (67% off)!',
    storeId: 'store-cvs',
    storeName: 'CVS Pharmacy',
    storeLogo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'cvs.com',
    dealType: 'coupon_stack',
    discountDisplay: '67% OFF ($3.11 each)',
    category: 'Personal Care & Beauty',
    subcategory: 'Body Wash',
    targetUrl: 'https://www.cvs.com',
    directMerchantUrl: 'https://www.cvs.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Nationwide at CVS Pharmacy stores and cvs.com with ExtraCare',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 18.98,
    currentPrice: 14.23,
    outOfPocketPrice: 10.23,
    estimatedFinalPrice: 6.23,
    estimatedSavingsDollar: 12.75,
    estimatedSavingsPercent: 67.2,
    isMoneyMaker: false,
    dealScore: 94,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    productName: 'Dove Deep Moisture Nourishing Body Wash 20 oz (2-Pack Stack)',
    productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
    tags: ['The Krazy Coupon Lady', 'CVS ExtraCare', 'Dove', 'Ibotta', 'BOGO Stack'],
    createdAt: new Date().toISOString(),
    popularityCount: 980,
    howToGetSteps: [
      'In the CVS ExtraCare app, clip the "$4.00/2 Dove Body Wash" manufacturer digital coupon',
      'In Ibotta, activate the "$1.00/1 Dove Body Wash" cash back offer',
      'Buy 2 bottles of Dove Body Wash at CVS. With BOGO 50% off sale, subtotal is $14.23',
      'Scan ExtraCare card at register. $4.00 coupon deducts immediately, pay $10.23 out of pocket',
      'Receipt prints $2.00 ExtraBucks Rewards',
      'Submit receipt to Ibotta for $2.00 cash back ($1.00 per bottle)',
      'Net final cost: $6.23 for both ($3.11 each instead of $9.49)!'
    ],
    savingsRecipe: {
      whatToBuy: '2 Dove Deep Moisture Body Washes (20 oz each)',
      quantityRequired: 2,
      regularUnitPrice: 9.49,
      regularTotalPrice: 18.98,
      saleUnitPrice: 7.12,
      saleTotalPrice: 14.23,
      salePromotionType: 'BOGO_50',
      coupons: [
        {
          title: '$4.00/2 Dove Body Wash Digital Manufacturer Coupon',
          type: 'MANUFACTURER',
          discountAmount: 4.00,
          clipRequired: true,
          source: 'CVS ExtraCare App'
        }
      ],
      totalCouponsDiscount: 4.00,
      outOfPocketToday: 10.23,
      rewardsEarned: [
        {
          name: '$2.00 ExtraBucks Rewards',
          type: 'EXTRABUCKS',
          amount: 2.00,
          timing: 'IMMEDIATE_AT_CHECKOUT',
          rollingAllowed: true
        }
      ],
      totalRewardsEarned: 2.00,
      cashbackRebates: [
        {
          provider: 'Ibotta',
          amount: 2.00,
          type: 'REBATE',
          submissionRequirement: 'Scan CVS receipt in Ibotta app',
          verificationStatus: 'CONFIRMED'
        }
      ],
      totalCashbackRebates: 2.00,
      effectiveNetCost: 6.23,
      effectiveNetPerUnit: 3.11,
      isMoneyMaker: false,
      stepByStepInstructions: [
        { stepNumber: 1, instruction: 'Clip $4/2 coupon in CVS app + save Ibotta offer' },
        { stepNumber: 2, instruction: 'Pick up 2 Dove Body Washes with BOGO 50% ($14.23 total)' },
        { stepNumber: 3, instruction: 'Pay $10.23 at checkout, receive $2 ECB + $2 Ibotta = $3.11 each' }
      ]
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      method: 'official_api_feed',
      source: 'The Krazy Coupon Lady / CVS ExtraCare Stack',
      confidenceScore: 98,
      userConfirmations: 175,
      userFailureReports: 0
    },
    expiration: {
      label: 'Active through Saturday',
      isExpiringSoon: false,
      isExpired: false,
      expirationSource: 'retailer_terms',
      expirationConfidence: 95
    }
  }
];
