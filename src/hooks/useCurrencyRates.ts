import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyRate {
  currency_code: string;
  rate_to_usd: number;
}

export const useCurrencyRates = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data, error } = await supabase
          .from('currency_rates')
          .select('currency_code, rate_to_usd');

        if (error) throw error;

        if (data) {
          const ratesMap: Record<string, number> = {};
          data.forEach((rate: CurrencyRate) => {
            ratesMap[rate.currency_code] = Number(rate.rate_to_usd);
          });
          setRates(ratesMap);
        }
      } catch (error) {
        console.error('Error fetching currency rates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertFromUSD = (amountUSD: number, toCurrency: string): number => {
    if (!rates[toCurrency]) return amountUSD;
    return amountUSD / rates[toCurrency];
  };

  const convertToUSD = (amount: number, fromCurrency: string): number => {
    if (!rates[fromCurrency]) return amount;
    return amount * rates[fromCurrency];
  };

  return { rates, convertFromUSD, convertToUSD, loading };
};
