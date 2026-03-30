import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
  RefreshControl,
  StatusBar,
} from "react-native";

const ok=1
const Api_Key='d75f7ohr01qk56kci3fgd75f7ohr01qk56kci3g0'
const Base_url = 'https://finnhub.io/api/v1'

const CATEGORIES = ["general", "forex", "crypto", "merger"]

interface NewsItem {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const fetchFinanceNews = async () => {
  const response = await fetch(
    `https://finnhub.io/api/v1/news?category=general&token=${Api_Key}`
  );
  const data = await response.json();
  return data; // array de artigos com title, url, image, summary, source
}
