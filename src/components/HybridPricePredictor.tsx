import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, TrendingUp, TrendingDown, Info, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OHLCVData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PredictionResponse {
  prediction: number;
  probability: number;
  confidence: string;
  features_used: Record<string, number>;
  data_source: string;
  symbol?: string;
  error?: string;
}

interface HybridPricePredictorProps {
  className?: string;
}

export default function HybridPricePredictor({ className }: HybridPricePredictorProps) {
  // Manual OHLCV state
  const [manualOHLCV, setManualOHLCV] = useState<OHLCVData>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0
  });

  // Symbol input state
  const [symbol, setSymbol] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [market, setMarket] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('manual');

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateManualInput = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (manualOHLCV.open <= 0) errors.open = 'Open price must be greater than 0';
    if (manualOHLCV.high <= 0) errors.high = 'High price must be greater than 0';
    if (manualOHLCV.low <= 0) errors.low = 'Low price must be greater than 0';
    if (manualOHLCV.close <= 0) errors.close = 'Close price must be greater than 0';
    if (manualOHLCV.volume < 0) errors.volume = 'Volume cannot be negative';
    
    if (manualOHLCV.high < manualOHLCV.low) {
      errors.high = 'High price cannot be less than low price';
      errors.low = 'Low price cannot be greater than high price';
    }
    
    if (manualOHLCV.high < manualOHLCV.open || manualOHLCV.high < manualOHLCV.close) {
      errors.high = 'High price must be >= open and close prices';
    }
    
    if (manualOHLCV.low > manualOHLCV.open || manualOHLCV.low > manualOHLCV.close) {
      errors.low = 'Low price must be <= open and close prices';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSymbolInput = (): boolean => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return false;
    }
    return true;
  };

  const handleManualInputChange = (field: keyof OHLCVData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setManualOHLCV(prev => ({ ...prev, [field]: numValue }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePredict = async () => {
    setError(null);
    setPrediction(null);
    setIsLoading(true);

    try {
      let requestBody: any;

      if (activeTab === 'manual') {
        if (!validateManualInput()) {
          setIsLoading(false);
          return;
        }
        requestBody = {
          ohlcv_data: manualOHLCV
        };
      } else {
        if (!validateSymbolInput()) {
          setIsLoading(false);
          return;
        }
        requestBody = {
          symbol: symbol.trim(),
          timezone,
          market: market || undefined
        };
      }

      const response = await fetch('http://localhost:8001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Prediction failed');
      }

      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setManualOHLCV({ open: 0, high: 0, low: 0, close: 0, volume: 0 });
    setSymbol('');
    setTimezone('UTC');
    setMarket('');
    setPrediction(null);
    setError(null);
    setValidationErrors({});
  };

  const handleRetrain = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8001/retrain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Retraining failed');
      }

      setError(null);
      // Show success message
      setError('Model retrained successfully!');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retraining failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (activeTab === 'manual') {
      return validateManualInput();
    } else {
      return symbol.trim().length > 0;
    }
  };

  const getPredictionIcon = () => {
    if (!prediction) return null;
    return prediction.prediction === 1 ? (
      <TrendingUp className="h-6 w-6 text-green-500" />
    ) : (
      <TrendingDown className="h-6 w-6 text-red-500" />
    );
  };

  const getPredictionColor = () => {
    if (!prediction) return '';
    return prediction.prediction === 1 ? 'text-green-600' : 'text-red-600';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <TooltipProvider>
      <div className={`w-full max-w-4xl mx-auto ${className}`}>
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next Hour Price Predictor
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              AI-powered prediction using manual OHLCV data or automatic stock symbol fetching
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual" className="text-sm font-medium">
                  Manual OHLCV Input
                </TabsTrigger>
                <TabsTrigger value="symbol" className="text-sm font-medium">
                  Stock Symbol Input
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="open" className="text-sm font-medium">
                      Open Price *
                    </Label>
                    <Input
                      id="open"
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualOHLCV.open || ''}
                      onChange={(e) => handleManualInputChange('open', e.target.value)}
                      className={validationErrors.open ? 'border-red-500' : ''}
                      placeholder="100.00"
                    />
                    {validationErrors.open && (
                      <p className="text-sm text-red-500">{validationErrors.open}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="high" className="text-sm font-medium">
                      High Price *
                    </Label>
                    <Input
                      id="high"
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualOHLCV.high || ''}
                      onChange={(e) => handleManualInputChange('high', e.target.value)}
                      className={validationErrors.high ? 'border-red-500' : ''}
                      placeholder="105.00"
                    />
                    {validationErrors.high && (
                      <p className="text-sm text-red-500">{validationErrors.high}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="low" className="text-sm font-medium">
                      Low Price *
                    </Label>
                    <Input
                      id="low"
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualOHLCV.low || ''}
                      onChange={(e) => handleManualInputChange('low', e.target.value)}
                      className={validationErrors.low ? 'border-red-500' : ''}
                      placeholder="98.00"
                    />
                    {validationErrors.low && (
                      <p className="text-sm text-red-500">{validationErrors.low}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="close" className="text-sm font-medium">
                      Close Price *
                    </Label>
                    <Input
                      id="close"
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualOHLCV.close || ''}
                      onChange={(e) => handleManualInputChange('close', e.target.value)}
                      className={validationErrors.close ? 'border-red-500' : ''}
                      placeholder="103.00"
                    />
                    {validationErrors.close && (
                      <p className="text-sm text-red-500">{validationErrors.close}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume" className="text-sm font-medium">
                      Volume *
                    </Label>
                    <Input
                      id="volume"
                      type="number"
                      min="0"
                      value={manualOHLCV.volume || ''}
                      onChange={(e) => handleManualInputChange('volume', e.target.value)}
                      className={validationErrors.volume ? 'border-red-500' : ''}
                      placeholder="1000000"
                    />
                    {validationErrors.volume && (
                      <p className="text-sm text-red-500">{validationErrors.volume}</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="symbol" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol" className="text-sm font-medium flex items-center gap-2">
                      Stock Symbol *
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Examples: AAPL, MSFT, RELIANCE.NS, TCS.BO, GOOGL</p>
                          <p className="text-xs mt-1">
                            NSE: .NS suffix, BSE: .BO suffix, US stocks: no suffix
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="symbol"
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      placeholder="AAPL, RELIANCE.NS, TCS.BO"
                      className="uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm font-medium">
                      Timezone
                    </Label>
                    <select
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (NYSE)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (NASDAQ)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (NSE/BSE)</option>
                      <option value="Europe/London">Europe/London (LSE)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market" className="text-sm font-medium">
                    Market (Optional)
                  </Label>
                  <Input
                    id="market"
                    type="text"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    placeholder="NYSE, NASDAQ, NSE, BSE"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handlePredict}
                disabled={isLoading || !isFormValid()}
                className="flex-1 sm:flex-none px-8 py-3 text-lg font-medium"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  'Predict Next Hour'
                )}
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
                className="flex-1 sm:flex-none px-8 py-3 text-lg font-medium"
                size="lg"
              >
                Clear Form
              </Button>

              <Button
                onClick={handleRetrain}
                variant="outline"
                disabled={isLoading}
                className="flex-1 sm:flex-none px-8 py-3 text-lg font-medium"
                size="lg"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Retrain Model
              </Button>
            </div>

            {error && (
              <Alert className={error.includes('successfully') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={error.includes('successfully') ? 'text-green-800' : 'text-red-800'}>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {prediction && (
              <Card className="mt-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {getPredictionIcon()}
                    <span className={getPredictionColor()}>
                      {prediction.prediction === 1 ? 'Price Going UP' : 'Price Going DOWN'}
                    </span>
                    <Badge className={getConfidenceColor(prediction.confidence)}>
                      {prediction.confidence} Confidence
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Probability: {(prediction.probability * 100).toFixed(1)}% | 
                    Data Source: {prediction.data_source}
                    {prediction.symbol && ` | Symbol: ${prediction.symbol}`}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Features Used for Prediction:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                        {Object.entries(prediction.features_used).map(([key, value]) => (
                          <div key={key} className="bg-white p-2 rounded border">
                            <span className="font-medium text-gray-600">{key.replace('_', ' ')}:</span>
                            <br />
                            <span className="text-gray-800">{typeof value === 'number' ? value.toFixed(4) : value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
