import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, BarChart3, Copy, CheckCircle, Upload, FileText, FileUp, AlertTriangle, Info, Download, Eye, Settings, Target, TrendingUp, Shield, Database, Zap } from 'lucide-react';
import { useOHLCVAnalyst } from '../hooks/useAgents';

interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface DataValidationResult {
  isValid: boolean;
  data: OHLCVData[];
  errors: string[];
  warnings: string[];
}

export default function OHLCVAnalyst() {
  const [symbol, setSymbol] = useState('');
  const [analysisType, setAnalysisType] = useState('Comprehensive Market Analysis');
  const [jsonInput, setJsonInput] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [inputFormat, setInputFormat] = useState<'json' | 'csv' | 'raw'>('json');
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState<DataValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, loading, error, analyzeOHLCV, reset } = useOHLCVAnalyst();

  // Helper function to get current input based on format
  const getCurrentInput = () => {
    switch (inputFormat) {
      case 'json':
        return jsonInput;
      case 'csv':
        return csvInput;
      case 'raw':
        return jsonInput; // Raw uses the same input as JSON
      default:
        return jsonInput;
    }
  };

  // Data validation and conversion functions
  const validateAndConvertData = (input: string, format: 'json' | 'csv' | 'raw'): DataValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let convertedData: OHLCVData[] = [];

    try {
      if (format === 'json') {
        const parsed = JSON.parse(input.trim());
        if (!Array.isArray(parsed)) {
          errors.push('JSON data must be an array of objects');
          return { isValid: false, data: [], errors, warnings };
        }
        convertedData = parsed;
      } else if (format === 'csv') {
        convertedData = parseCSVData(input, errors, warnings);
      } else if (format === 'raw') {
        convertedData = parseRawData(input, errors, warnings);
      }

      // Validate each data point
      const validData: OHLCVData[] = [];
      convertedData.forEach((item, index) => {
        const itemErrors: string[] = [];
        
        // Check required fields
        const requiredFields = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];
        requiredFields.forEach(field => {
          if (item[field] === undefined || item[field] === null) {
            itemErrors.push(`Missing ${field} field`);
          } else if (typeof item[field] !== 'number' || !isFinite(item[field])) {
            itemErrors.push(`${field} must be a valid number`);
          }
        });

        // Validate OHLC relationships
        if (itemErrors.length === 0) {
          if (item.high < item.low) {
            itemErrors.push('High price cannot be less than low price');
          }
          if (item.high < item.open || item.high < item.close) {
            itemErrors.push('High price must be >= open and close prices');
          }
          if (item.low > item.open || item.low > item.close) {
            itemErrors.push('Low price must be <= open and close prices');
          }
          if (item.volume < 0) {
            itemErrors.push('Volume cannot be negative');
          }
        }

        if (itemErrors.length > 0) {
          errors.push(`Row ${index + 1}: ${itemErrors.join(', ')}`);
        } else {
          validData.push(item);
        }
      });

      if (validData.length === 0) {
        errors.push('No valid data points found');
      } else if (validData.length < convertedData.length) {
        warnings.push(`${convertedData.length - validData.length} invalid rows were skipped`);
      }

      return {
        isValid: validData.length > 0,
        data: validData,
        errors,
        warnings
      };
    } catch (err) {
      errors.push(`Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return { isValid: false, data: [], errors, warnings };
    }
  };

  const parseCSVData = (csvText: string, errors: string[], warnings: string[]): OHLCVData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      errors.push('CSV must have at least a header row and one data row');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: OHLCVData[] = [];

    // Map common column names
    const columnMap: { [key: string]: string } = {
      'date': 'timestamp',
      'time': 'timestamp',
      'datetime': 'timestamp',
      'o': 'open',
      'h': 'high',
      'l': 'low',
      'c': 'close',
      'v': 'volume',
      'vol': 'volume'
    };

    const mappedHeaders = headers.map(h => columnMap[h] || h);
    const requiredFields = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];
    const missingFields = requiredFields.filter(field => !mappedHeaders.includes(field));
    
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(', ')}`);
      return [];
    }

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        warnings.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        const mappedHeader = columnMap[header] || header;
        let value = values[index];

        if (mappedHeader === 'timestamp') {
          // Try to parse various date formats
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            // Try parsing as timestamp
            const timestamp = parseFloat(value);
            if (!isNaN(timestamp)) {
              row[mappedHeader] = timestamp < 1e12 ? timestamp * 1000 : timestamp; // Convert to milliseconds if needed
            } else {
              row[mappedHeader] = NaN;
            }
          } else {
            row[mappedHeader] = date.getTime();
          }
        } else {
          row[mappedHeader] = parseFloat(value);
        }
      });

      data.push(row);
    }

    return data;
  };

  const parseRawData = (rawText: string, errors: string[], warnings: string[]): OHLCVData[] => {
    // Try to detect format and parse accordingly
    const lines = rawText.trim().split('\n');
    const data: OHLCVData[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 6) {
        try {
          const timestamp = new Date(parts[0]).getTime();
          if (isNaN(timestamp)) {
            warnings.push(`Invalid date format: ${parts[0]}`);
            continue;
          }

          data.push({
            timestamp,
            open: parseFloat(parts[1]),
            high: parseFloat(parts[2]),
            low: parseFloat(parts[3]),
            close: parseFloat(parts[4]),
            volume: parseFloat(parts[5])
          });
        } catch (err) {
          warnings.push(`Failed to parse line: ${line}`);
        }
      }
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const currentInput = inputFormat === 'json' ? jsonInput : inputFormat === 'csv' ? csvInput : jsonInput;
    if (!currentInput.trim()) return;

    const validation = validateAndConvertData(currentInput, inputFormat);
    setValidationResult(validation);

    if (validation.isValid) {
      await analyzeOHLCV(validation.data, symbol || undefined, analysisType);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileName = file.name.toLowerCase();
      
      if (fileName.endsWith('.csv')) {
        setCsvInput(content);
        setInputFormat('csv');
      } else if (fileName.endsWith('.json')) {
        setJsonInput(content);
        setInputFormat('json');
      } else {
        // Try to detect format
        if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
          setJsonInput(content);
          setInputFormat('json');
        } else if (content.includes(',')) {
          setCsvInput(content);
          setInputFormat('csv');
        } else {
          setJsonInput(content);
          setInputFormat('raw');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = async () => {
    if (!data?.analysis) return;
    
    try {
      await navigator.clipboard.writeText(data.analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleReset = () => {
    reset();
    setJsonInput('');
    setCsvInput('');
    setSymbol('');
    setAnalysisType('Comprehensive Market Analysis');
    setCopied(false);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exampleOHLCV = [
    {
      timestamp: 1704067200000,
      open: 150.0,
      high: 155.5,
      low: 149.2,
      close: 154.8,
      volume: 45000000
    },
    {
      timestamp: 1704153600000,
      open: 154.8,
      high: 157.2,
      low: 153.1,
      close: 156.5,
      volume: 52000000
    }
  ];

  const analysisTypes = [
    'Comprehensive Market Analysis',
    'Price Action Analysis',
    'Volume Analysis',
    'Technical Pattern Recognition',
    'Risk Assessment',
    'Trading Opportunities',
    'Market Sentiment Analysis'
  ];

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-green-900">
                AI OHLCV Data Analyst
              </CardTitle>
              <CardDescription className="text-green-700 mt-1">
                Upload OHLCV market data for comprehensive AI-powered analysis including price action, volume patterns, technical indicators, and trading opportunities.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Powered by Gemini AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Configuration Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Analysis Configuration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="symbol" className="text-sm font-medium text-blue-800">
                  Symbol (Optional):
                </label>
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g., AAPL, TSLA, BTC-USD"
                  disabled={loading}
                  className="bg-white border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="analysis-type" className="text-sm font-medium text-blue-800">
                  Analysis Type:
                </label>
                <Select value={analysisType} onValueChange={setAnalysisType} disabled={loading}>
                  <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Upload Data File</h3>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center gap-2 bg-white border-purple-200 hover:border-purple-400 hover:bg-purple-50"
              >
                <FileUp className="h-4 w-4" />
                Choose File
              </Button>
              <div className="text-sm text-purple-700">
                <span className="font-medium">Supported formats:</span> CSV, JSON, or raw text files
              </div>
            </div>
          </div>

          {/* Data Input Tabs */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Data Input</h3>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Or paste your data directly:</label>
              <Tabs value={inputFormat} onValueChange={(value) => setInputFormat(value as 'json' | 'csv' | 'raw')}>
                <TabsList className="grid w-full grid-cols-3 bg-white border">
                  <TabsTrigger value="json" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    <FileText className="h-3 w-3 mr-1" />
                    JSON
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900">
                    <FileText className="h-3 w-3 mr-1" />
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900">
                    <FileText className="h-3 w-3 mr-1" />
                    Raw Text
                  </TabsTrigger>
                </TabsList>
              
                <TabsContent value="json" className="space-y-2">
                  <div className="bg-white p-3 rounded-lg border">
                    <Textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder={`Paste your OHLCV data here as JSON array:\n\n${JSON.stringify(exampleOHLCV, null, 2)}`}
                      rows={12}
                      className="min-h-[300px] font-mono text-sm border-0 focus:ring-0"
                      disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{jsonInput.length}/10000 characters</span>
                      <Badge variant="outline" className="text-xs">JSON Format</Badge>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="csv" className="space-y-2">
                  <div className="bg-white p-3 rounded-lg border">
                    <Textarea
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder={`Paste your CSV data here:\n\ndate,open,high,low,close,volume\n2024-01-01,150.0,155.5,149.2,154.8,45000000\n2024-01-02,154.8,157.2,153.1,156.5,52000000`}
                      rows={12}
                      className="min-h-[300px] font-mono text-sm border-0 focus:ring-0"
                      disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{csvInput.length}/10000 characters</span>
                      <Badge variant="outline" className="text-xs">CSV Format</Badge>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="raw" className="space-y-2">
                  <div className="bg-white p-3 rounded-lg border">
                    <Textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder={`Paste your raw data here (space or tab separated):\n\n2024-01-01 150.0 155.5 149.2 154.8 45000000\n2024-01-02 154.8 157.2 153.1 156.5 52000000`}
                      rows={12}
                      className="min-h-[300px] font-mono text-sm border-0 focus:ring-0"
                      disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{jsonInput.length}/10000 characters</span>
                      <Badge variant="outline" className="text-xs">Raw Text</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Example Data Section */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Quick Examples</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setJsonInput(JSON.stringify(exampleOHLCV, null, 2));
                  setInputFormat('json');
                }}
                disabled={loading}
                className="text-xs bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50"
              >
                <FileText className="h-3 w-3 mr-1" />
                Load JSON Example
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setCsvInput(`date,open,high,low,close,volume
2024-01-01,150.0,155.5,149.2,154.8,45000000
2024-01-02,154.8,157.2,153.1,156.5,52000000
2024-01-03,156.5,159.8,155.2,158.3,48000000`);
                  setInputFormat('csv');
                }}
                disabled={loading}
                className="text-xs bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50"
              >
                <FileText className="h-3 w-3 mr-1" />
                Load CSV Example
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Ready to Analyze</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!getCurrentInput().trim() || loading || getCurrentInput().length > 10000}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4" />
                      Analyze with Gemini AI
                    </>
                  )}
                </Button>
                {(data || error || validationResult) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                    className="border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Validation Results */}
        {validationResult && (
          <div className="space-y-2">
            {validationResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">Data Validation Errors:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {validationResult.errors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {validationResult.warnings.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">Warnings:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {validationResult.isValid && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="font-medium">Data validation successful!</div>
                  <div className="text-sm">
                    Found {validationResult.data.length} valid data points ready for analysis.
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">AI Market Analysis</h3>
                    <p className="text-sm text-green-700">Comprehensive analysis of your market data</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {data.data_points_analyzed} Data Points
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-1 border-green-200 hover:border-green-400 hover:bg-green-50"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Analysis Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <div className="font-medium text-blue-900">Symbol</div>
                </div>
                <div className="text-blue-700 font-semibold">{data.symbol}</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-green-600" />
                  <div className="font-medium text-green-900">Analysis Type</div>
                </div>
                <div className="text-green-700 font-semibold">{data.analysis_type}</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-purple-600" />
                  <div className="font-medium text-purple-900">Data Points</div>
                </div>
                <div className="text-purple-700 font-semibold">{data.data_points_analyzed}</div>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Analysis Results</h4>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                  {data.analysis}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Generated by {data.powered_by}
              </div>
              <div className="flex items-center gap-4">
                <span>Analysis Complete</span>
                <Badge variant="outline" className="text-xs">
                  Ready for Trading
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Supported Data Formats */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-green-900">Supported Data Formats</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <strong className="text-blue-900">JSON Format</strong>
              </div>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Array of objects</li>
                <li>• timestamp, open, high, low, close, volume</li>
                <li>• Unix timestamp in milliseconds</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-600" />
                <strong className="text-green-900">CSV Format</strong>
              </div>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Header row required</li>
                <li>• Flexible column names</li>
                <li>• Auto-detects date formats</li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <strong className="text-purple-900">Raw Text</strong>
              </div>
              <ul className="space-y-1 text-sm text-purple-800">
                <li>• Space/tab separated</li>
                <li>• Date OHLCV format</li>
                <li>• One row per data point</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Analysis Features */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Analysis Features</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Price action and trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Volume pattern recognition
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Technical indicator insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Support and resistance levels
                </li>
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Risk assessment and volatility metrics
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Trading opportunity identification
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Market sentiment analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  AI-powered insights and recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
