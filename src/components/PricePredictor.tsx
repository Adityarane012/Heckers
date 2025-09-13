import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

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
  error?: string;
}

interface PredictionResult {
  prediction: number;
  probability: number;
  confidence: string;
  timestamp: string;
}

export function PricePredictor() {
  const [formData, setFormData] = useState<OHLCVData>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const API_BASE_URL = "http://localhost:8000";

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Check for required fields
    if (formData.open <= 0) errors.open = "Open price must be greater than 0";
    if (formData.high <= 0) errors.high = "High price must be greater than 0";
    if (formData.low <= 0) errors.low = "Low price must be greater than 0";
    if (formData.close <= 0) errors.close = "Close price must be greater than 0";
    if (formData.volume < 0) errors.volume = "Volume cannot be negative";
    
    // Check logical consistency
    if (formData.high < formData.low) {
      errors.high = "High price cannot be less than low price";
      errors.low = "Low price cannot be greater than high price";
    }
    
    if (formData.high < formData.open) {
      errors.high = "High price cannot be less than open price";
    }
    
    if (formData.high < formData.close) {
      errors.high = "High price cannot be less than close price";
    }
    
    if (formData.low > formData.open) {
      errors.low = "Low price cannot be greater than open price";
    }
    
    if (formData.low > formData.close) {
      errors.low = "Low price cannot be greater than close price";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof OHLCVData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePredict = async () => {
    if (!validateForm()) {
      setError("Please fix the validation errors before predicting");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult({
        prediction: data.prediction,
        probability: data.probability,
        confidence: data.confidence,
        timestamp: new Date().toLocaleString()
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/retrain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setError(null);
      // Show success message briefly
      setTimeout(() => {
        setError(null);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Retraining failed");
    } finally {
      setIsRetraining(false);
    }
  };

  const handleClear = () => {
    setFormData({
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      volume: 0
    });
    setResult(null);
    setError(null);
    setValidationErrors({});
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPredictionIcon = (prediction: number) => {
    return prediction === 1 ? (
      <TrendingUp className="w-6 h-6 text-green-600" />
    ) : (
      <TrendingDown className="w-6 h-6 text-red-600" />
    );
  };

  const getPredictionText = (prediction: number) => {
    return prediction === 1 ? "Price will go UP" : "Price will go DOWN";
  };

  const getPredictionColor = (prediction: number) => {
    return prediction === 1 ? "text-green-600" : "text-red-600";
  };

  return (
    <section id="price-predictor" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Next Hour Price Predictor</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Predict whether stock prices will go up or down in the next hour using AI-powered machine learning
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="card-trading">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                OHLCV Data Input
              </CardTitle>
              <CardDescription>
                Enter the current OHLCV (Open, High, Low, Close, Volume) data for prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="open" className="text-sm font-medium">
                    Open Price *
                  </Label>
                  <Input
                    id="open"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.open || ""}
                    onChange={(e) => handleInputChange("open", e.target.value)}
                    className={validationErrors.open ? "border-red-500" : ""}
                    placeholder="100.00"
                    aria-describedby={validationErrors.open ? "open-error" : undefined}
                  />
                  {validationErrors.open && (
                    <p id="open-error" className="text-sm text-red-500" role="alert">
                      {validationErrors.open}
                    </p>
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
                    value={formData.high || ""}
                    onChange={(e) => handleInputChange("high", e.target.value)}
                    className={validationErrors.high ? "border-red-500" : ""}
                    placeholder="105.00"
                    aria-describedby={validationErrors.high ? "high-error" : undefined}
                  />
                  {validationErrors.high && (
                    <p id="high-error" className="text-sm text-red-500" role="alert">
                      {validationErrors.high}
                    </p>
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
                    value={formData.low || ""}
                    onChange={(e) => handleInputChange("low", e.target.value)}
                    className={validationErrors.low ? "border-red-500" : ""}
                    placeholder="98.00"
                    aria-describedby={validationErrors.low ? "low-error" : undefined}
                  />
                  {validationErrors.low && (
                    <p id="low-error" className="text-sm text-red-500" role="alert">
                      {validationErrors.low}
                    </p>
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
                    value={formData.close || ""}
                    onChange={(e) => handleInputChange("close", e.target.value)}
                    className={validationErrors.close ? "border-red-500" : ""}
                    placeholder="103.00"
                    aria-describedby={validationErrors.close ? "close-error" : undefined}
                  />
                  {validationErrors.close && (
                    <p id="close-error" className="text-sm text-red-500" role="alert">
                      {validationErrors.close}
                    </p>
                  )}
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="volume" className="text-sm font-medium">
                    Volume *
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    min="0"
                    value={formData.volume || ""}
                    onChange={(e) => handleInputChange("volume", e.target.value)}
                    className={validationErrors.volume ? "border-red-500" : ""}
                    placeholder="10000"
                    aria-describedby={validationErrors.volume ? "volume-error" : undefined}
                  />
                  {validationErrors.volume && (
                    <p id="volume-error" className="text-sm text-red-500" role="alert">
                      {validationErrors.volume}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="flex-1 h-12 text-lg"
                  variant="trading"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Predict Next Hour
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleClear}
                  disabled={isLoading}
                  variant="outline"
                  className="h-12"
                >
                  Clear
                </Button>
              </div>

              <Button
                onClick={handleRetrain}
                disabled={isRetraining}
                variant="secondary"
                className="w-full h-10"
              >
                {isRetraining ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Retraining Model...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retrain Model
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="card-trading">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Prediction Results
              </CardTitle>
              <CardDescription>
                AI-powered prediction with confidence levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {!result ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Prediction Yet</h3>
                  <p className="text-muted-foreground">
                    Enter OHLCV data and click "Predict Next Hour" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Main Prediction */}
                  <div className="text-center p-6 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-center mb-4">
                      {getPredictionIcon(result.prediction)}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${getPredictionColor(result.prediction)}`}>
                      {getPredictionText(result.prediction)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Predicted at {result.timestamp}
                    </p>
                  </div>

                  {/* Confidence and Probability */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Confidence
                      </div>
                      <Badge className={`${getConfidenceColor(result.confidence)} border`}>
                        {result.confidence}
                      </Badge>
                    </div>

                    <div className="text-center p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Probability
                      </div>
                      <div className="text-xl font-bold">
                        {(result.probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Disclaimer:</strong> This prediction is for educational purposes only. 
                      Stock market predictions are inherently uncertain and should not be used as 
                      the sole basis for investment decisions.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
