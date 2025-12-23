#!/bin/bash

# Скрипт для переноса переменных окружения из .env.local в Vercel

echo "🚀 Начинаем перенос переменных окружения в Vercel..."

# Функция для добавления переменной во все окружения
add_env_var() {
  local name=$1
  local value=$2
  
  echo "Добавляем $name..."
  
  # Production
  echo "$value" | vercel env add "$name" production
  
  # Preview
  echo "$value" | vercel env add "$name" preview
  
  # Development
  echo "$value" | vercel env add "$name" development
}

# Supabase
add_env_var "SUPABASE_URL" "https://hspmtqlnrmomatmzklnh.supabase.co"
add_env_var "SUPABASE_ANON_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcG10cWxucm1vbWF0bXprbG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjIxMjAsImV4cCI6MjA4MDE5ODEyMH0.yr4SCzhBDETXbKhCMeQE2iQEcmmm9_GyvKKnCForFEo"
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcG10cWxucm1vbWF0bXprbG5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYyMjEyMCwiZXhwIjoyMDgwMTk4MTIwfQ.0yRA-Xsdlcux_lelSQ3uiwz40LcY36sy7DSidhLtjrM"

# Supabase (Next.js public variables)
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "https://hspmtqlnrmomatmzklnh.supabase.co"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzcG10cWxucm1vbWF0bXprbG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MjIxMjAsImV4cCI6MjA4MDE5ODEyMH0.yr4SCzhBDETXbKhCMeQE2iQEcmmm9_GyvKKnCForFEo"

# NextAuth
add_env_var "NEXTAUTH_URL" "https://www.cleenly.app/"
add_env_var "NEXTAUTH_SECRET" "ozmyR21dpaWvsYYMo6tlxw/PnS--JNBZLd1+q1ZABuhKwrQ="
add_env_var "AUTH_SECRET" "ozmyR21dpaWvsYYMo6tlxw/PnS--JNBZLd1+q1ZABuhKwrQ="

# Resend
add_env_var "RESEND_API_KEY" "re_dgK9uuc1_GutXC74AVXftnciWrbGHVrjt"

# Google
add_env_var "GOOGLE_CLIENT_ID" "856340560474-jbrgpmhr12n3a5i1t1bmk3d6u4l5mrq2.apps.googleusercontent.com"
add_env_var "GOOGLE_CLIENT_SECRET" "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"

# Twilio
add_env_var "TWILIO_ACCOUNT_SID" "AC224bac159a05138c072091f4b0f5a2fe"
add_env_var "TWILIO_AUTH_TOKEN" "e85808fd3db40a599a9637c23e92f8d0"
add_env_var "TWILIO_PHONE_NUMBER" "+18557109619"

# Telegram
add_env_var "TELEGRAM_BOT_TOKEN" "8151881048:AAH6U4W2pgXP46-gjRr2xDgELgObm0kk5_0"
add_env_var "NEXT_PUBLIC_TELEGRAM_BOT_USERNAME" "cleenlyapploginbot"

echo "✅ Все переменные окружения успешно добавлены в Vercel!"
