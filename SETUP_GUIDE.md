# 🚀 Полное руководство по настройке CI/CD

Это единственная инструкция, которая вам нужна для настройки CI/CD от начала до конца.

---

## 📋 Содержание

1. [Что уже готово](#что-уже-готово)
2. [Что нужно сделать](#что-нужно-сделать)
3. [Шаг 1: Создание репозиториев Docker Hub](#шаг-1-создание-репозиториев-docker-hub)
4. [Шаг 2: Создание SSH ключей](#шаг-2-создание-ssh-ключей)
5. [Шаг 3: Добавление GitHub Secrets](#шаг-3-добавление-github-secrets)
6. [Шаг 4: Настройка GitHub Environments](#шаг-4-настройка-github-environments)
7. [Шаг 5: Настройка серверов](#шаг-5-настройка-серверов)
8. [Шаг 6: Первый деплой](#шаг-6-первый-деплой)
9. [Troubleshooting](#troubleshooting)

---

## Что уже готово

✅ **Репозиторий GitHub:** https://github.com/MaxOrel/deploy_ci_cd (публичный)
✅ **Docker Hub аккаунт:** maxorel
✅ **Docker Hub токен:** dckr_pat_... (права: Read, Write, Delete)
✅ **Telegram Bot токен:** [ваш токен]
✅ **Telegram Chat ID:** [ваш chat ID]

✅ **Серверы:**
- **Staging:** 85.143.172.140 (пароль: CMPl4-zdFz6-MN8B2-HjR6u)
- **Production:** 212.193.48.217 (пароль: pyUc7-tqjtR-4SB42-dl9uY)

✅ **Домены:**
- **Staging:**
  - Frontend: https://stage.nomoredomainswork.ru
  - Backend API: https://api.stage.nomoredomainswork.ru
- **Production:**
  - Frontend: https://prod.nomorepartiessbs.ru
  - Backend API: https://api.prod.nomorepartiessbs.ru

---

## Что нужно сделать

1. ⏳ Создать 2 репозитория в Docker Hub
2. ⏳ Создать SSH ключи и добавить на серверы
3. ⏳ Добавить 30 секретов в GitHub
4. ⏳ Настроить GitHub Environments
5. ⏳ Установить Docker, Nginx, SSL на серверах
6. ⏳ Запустить первый деплой

---

## Шаг 1: Создание репозиториев Docker Hub

GitHub Actions не может пушить образы в несуществующие репозитории. Нужно их создать.

### Вариант A: Через командную строку (рекомендуется)

Откройте **Git Bash** или обычный терминал:

```bash
# 1. Войдите в Docker Hub
docker login -u maxorel
# Когда попросит пароль, введите ваш Docker Hub токен

# 2. Создайте репозитории (запушим временные образы)
docker pull alpine:latest
docker tag alpine:latest maxorel/backend-compose-optimized:init
docker tag alpine:latest maxorel/frontend-compose-optimized:init

docker push maxorel/backend-compose-optimized:init
docker push maxorel/frontend-compose-optimized:init

# 3. Готово! Репозитории созданы
```

### Вариант B: Через веб-интерфейс

1. Откройте https://hub.docker.com и войдите под `maxorel`
2. Нажмите **"Create Repository"**
3. Создайте:
   - Name: `backend-compose-optimized`, Visibility: **Public**
   - Name: `frontend-compose-optimized`, Visibility: **Public**

### Проверка

Репозитории должны быть доступны:
- https://hub.docker.com/r/maxorel/backend-compose-optimized
- https://hub.docker.com/r/maxorel/frontend-compose-optimized

---

## Шаг 2: Создание SSH ключей

SSH ключи нужны для того, чтобы GitHub Actions мог подключаться к серверам.

### Для Git Bash (Windows/Linux/Mac):

```bash
# Перейдите в директорию проекта
cd /e/YandexDisk/Mentor/Yandex/WEBINAR/Контенизируем\ приложение/node_21

# Создайте SSH ключи (нажимайте Enter на все вопросы - без passphrase)
ssh-keygen -t ed25519 -C "github-actions-staging" -f staging_key
ssh-keygen -t ed25519 -C "github-actions-production" -f production_key

# Скопируйте публичные ключи на серверы

# Staging (пароль: CMPl4-zdFz6-MN8B2-HjR6u)
cat staging_key.pub | ssh root@85.143.172.140 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@85.143.172.140 "chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"

# Production (пароль: pyUc7-tqjtR-4SB42-dl9uY)
cat production_key.pub | ssh root@212.193.48.217 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@212.193.48.217 "chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
```

### Для Windows PowerShell:

```powershell
# Перейдите в директорию проекта
cd "E:\YandexDisk\Mentor\Yandex\WEBINAR\Контенизируем приложение\node_21"

# Создайте SSH ключи
ssh-keygen -t ed25519 -C "github-actions-staging" -f staging_key
ssh-keygen -t ed25519 -C "github-actions-production" -f production_key

# Скопируйте ключи (используйте type вместо cat)
type staging_key.pub | ssh root@85.143.172.140 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@85.143.172.140 "chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"

type production_key.pub | ssh root@212.193.48.217 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@212.193.48.217 "chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
```

### Проверка (должно работать БЕЗ пароля):

```bash
ssh -i staging_key root@85.143.172.140 "echo 'Staging SSH works!'"
ssh -i production_key root@212.193.48.217 "echo 'Production SSH works!'"
```

---

## Шаг 3: Добавление GitHub Secrets

Перейдите: https://github.com/MaxOrel/deploy_ci_cd/settings/secrets/actions

Нажмите **"New repository secret"** и добавьте все 30 секретов:

### Docker Hub (2 секрета)
```
Name: DOCKER_HUB_USERNAME
Value: maxorel

Name: DOCKER_HUB_TOKEN
Value: [ваш Docker Hub токен]
```

### SSH Staging (3 секрета)
```
Name: STAGING_SSH_HOST
Value: 85.143.172.140

Name: STAGING_SSH_USER
Value: root

Name: STAGING_SSH_KEY
Value: [содержимое файла staging_key - приватного ключа БЕЗ .pub]
```
**Как скопировать приватный ключ:**
- Git Bash: `cat staging_key` → скопировать весь вывод
- PowerShell: `Get-Content staging_key | clip` → вставить из буфера

### SSH Production (3 секрета)
```
Name: PRODUCTION_SSH_HOST
Value: 212.193.48.217

Name: PRODUCTION_SSH_USER
Value: root

Name: PRODUCTION_SSH_KEY
Value: [содержимое файла production_key]
```

### Database Staging (3 секрета)
```
Name: STAGING_POSTGRES_DB
Value: staging_db

Name: STAGING_POSTGRES_USER
Value: staging_user

Name: STAGING_POSTGRES_PASSWORD
Value: StAgInG_Str0ng_P@ssw0rd_123
```

### Database Production (3 секрета)
```
Name: PRODUCTION_POSTGRES_DB
Value: production_db

Name: PRODUCTION_POSTGRES_USER
Value: prod_user

Name: PRODUCTION_POSTGRES_PASSWORD
Value: Pr0d_VeRy_Str0ng_P@ssw0rd_456!
```

### Ports Staging (3 секрета)
```
Name: STAGING_BACKEND_PORT
Value: 4000

Name: STAGING_FRONTEND_PORT
Value: 9000

Name: STAGING_ADMINER_PORT
Value: 9001
```

### Ports Production (3 секрета)
```
Name: PRODUCTION_BACKEND_PORT
Value: 4000

Name: PRODUCTION_FRONTEND_PORT
Value: 9000

Name: PRODUCTION_ADMINER_PORT
Value: 9001
```

### URLs Staging (4 секрета)
```
Name: STAGING_API_URL
Value: https://api.stage.nomoredomainswork.ru/

Name: STAGING_BACKEND_URL
Value: https://api.stage.nomoredomainswork.ru

Name: STAGING_FRONTEND_URL
Value: https://stage.nomoredomainswork.ru

Name: STAGING_ADMINER_URL
Value: https://stage.nomoredomainswork.ru:9001
```

### URLs Production (3 секрета)
```
Name: PRODUCTION_API_URL
Value: https://api.prod.nomorepartiessbs.ru/

Name: PRODUCTION_BACKEND_URL
Value: https://api.prod.nomorepartiessbs.ru

Name: PRODUCTION_FRONTEND_URL
Value: https://prod.nomorepartiessbs.ru
```

### Telegram (2 секрета)
```
Name: TELEGRAM_BOT_TOKEN
Value: [ваш Telegram Bot токен]

Name: TELEGRAM_CHAT_ID
Value: [ваш Telegram Chat ID]
```

**Итого: 30 секретов**

---

## Шаг 4: Настройка GitHub Environments

Перейдите: https://github.com/MaxOrel/deploy_ci_cd/settings/environments

### Создайте Staging Environment:
1. Нажмите **"New environment"**
2. Name: `staging`
3. Deployment branches: **No restriction**
4. Required reviewers: оставьте пустым
5. **Save protection rules**

### Создайте Production Environment:
1. Нажмите **"New environment"**
2. Name: `production`
3. Deployment branches and tags: **Selected branches and tags**
   - Нажмите **"Add deployment branch or tag rule"**
   - Ref type: **Tags**
   - Name pattern: `refs/tags/v*`
   - Нажмите **"Add rule"**
4. Required reviewers: **✓ Включить**
   - Добавьте себя (MaxOrel) в reviewers
5. **Save protection rules**

---

## Шаг 5: Настройка серверов

Подключитесь к каждому серверу и установите Docker, Nginx, SSL.

### Staging сервер (85.143.172.140):

```bash
# 1. Подключитесь
ssh root@85.143.172.140
# Пароль: CMPl4-zdFz6-MN8B2-HjR6u

# 2. Скопируйте и выполните ВСЁ одним блоком:
apt update && apt upgrade -y && \
curl -fsSL https://get.docker.com -o get-docker.sh && \
sh get-docker.sh && \
rm get-docker.sh && \
apt install -y nginx certbot python3-certbot-nginx curl wget git nano && \
mkdir -p /home/deploy/staging/backups && \
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable

# 3. Проверьте Docker
docker --version && docker compose version

# 4. Создайте Nginx конфигурацию
cat > /etc/nginx/sites-available/staging << 'EOF'
server {
    listen 80;
    server_name stage.nomoredomainswork.ru;
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.stage.nomoredomainswork.ru;
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 5. Активируйте конфигурацию
ln -sf /etc/nginx/sites-available/staging /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. Получите SSL сертификаты (ЗАМЕНИТЕ EMAIL!)
certbot --nginx \
  -d stage.nomoredomainswork.ru \
  -d api.stage.nomoredomainswork.ru \
  --non-interactive --agree-tos \
  --email your-email@example.com

# 7. Выход
exit
```

### Production сервер (212.193.48.217):

```bash
# 1. Подключитесь
ssh root@212.193.48.217
# Пароль: pyUc7-tqjtR-4SB42-dl9uY

# 2. Скопируйте и выполните ВСЁ одним блоком:
apt update && apt upgrade -y && \
curl -fsSL https://get.docker.com -o get-docker.sh && \
sh get-docker.sh && \
rm get-docker.sh && \
apt install -y nginx certbot python3-certbot-nginx curl wget git nano && \
mkdir -p /home/deploy/production/backups && \
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable

# 3. Проверьте Docker
docker --version && docker compose version

# 4. Создайте Nginx конфигурацию
cat > /etc/nginx/sites-available/production << 'EOF'
server {
    listen 80;
    server_name prod.nomorepartiessbs.ru;
    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.prod.nomorepartiessbs.ru;
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 5. Активируйте конфигурацию
ln -sf /etc/nginx/sites-available/production /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 6. Получите SSL сертификаты (ЗАМЕНИТЕ EMAIL!)
certbot --nginx \
  -d prod.nomorepartiessbs.ru \
  -d api.prod.nomorepartiessbs.ru \
  --non-interactive --agree-tos \
  --email your-email@example.com

# 7. Выход
exit
```

### Проверка серверов:

```bash
# Должно работать без ошибок
ssh -i staging_key root@85.143.172.140 "docker --version && nginx -t"
ssh -i production_key root@212.193.48.217 "docker --version && nginx -t"
```

---

## Шаг 6: Первый деплой

### Вариант A: Перезапуск существующего PR

Если у вас уже есть открытый PR (например, test/ci-cd-setup):

1. Откройте https://github.com/MaxOrel/deploy_ci_cd/actions
2. Найдите упавший workflow "Deploy to Staging"
3. Нажмите **"Re-run failed jobs"**

### Вариант B: Создание нового PR

```bash
# 1. Создайте новую ветку
git checkout -b test/deployment

# 2. Сделайте любое изменение
echo "Test deployment" >> README.md
git add README.md
git commit -m "test: verify deployment setup"

# 3. Запушьте и создайте PR
git push origin test/deployment
```

Затем создайте PR на GitHub: https://github.com/MaxOrel/deploy_ci_cd/compare

### Что должно произойти:

1. ✅ **CI проверки** (lint, tests, build) - должны пройти
2. ✅ **Build & Push Images** - образы собираются и пушатся в Docker Hub
3. ✅ **Deploy to Staging** - деплой на staging сервер
4. ✅ **Telegram уведомление** - сообщение об успешном деплое
5. ✅ **Комментарий в PR** - с URL staging окружения

### Проверка деплоя:

Откройте в браузере:
- Frontend: https://stage.nomoredomainswork.ru
- Backend: https://api.stage.nomoredomainswork.ru/health

---

## Troubleshooting

### Проблема: Docker Hub - "pull access denied"

**Причина:** Репозитории не созданы в Docker Hub

**Решение:** Выполните [Шаг 1](#шаг-1-создание-репозиториев-docker-hub)

---

### Проблема: SSH - "Permission denied"

**Причина:** SSH ключи не добавлены на сервер

**Решение:**
```bash
# Для staging
cat staging_key.pub | ssh root@85.143.172.140 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@85.143.172.140 "chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"

# Для production
cat production_key.pub | ssh root@212.193.48.217 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
ssh root@212.193.48.217 "chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
```

---

### Проблема: Nginx - "502 Bad Gateway"

**Причина:** Docker контейнеры не запущены

**Решение:**
```bash
# Подключитесь к серверу
ssh -i staging_key root@85.143.172.140

# Проверьте контейнеры
cd /home/deploy/staging
docker compose -f docker-compose.staging.yml ps

# Посмотрите логи
docker compose -f docker-compose.staging.yml logs
```

---

### Проблема: Database - "POSTGRES_PASSWORD is not set"

**Причина:** Переменные окружения не передаются

**Решение:** Проверьте, что `.env.staging` файл создается в workflow и содержит все переменные

---

### Проблема: Frontend TypeScript errors

**Причина:** node_modules не исключен из проверки

**Решение:** Уже исправлено в `tsconfig.json` - добавлен `exclude`

---

### Проблема: GitHub Actions - "secrets not accessible"

**Причина:** Secrets используются в неправильном контексте (например, в `environment.url`)

**Решение:** Уже исправлено - используются статические URL вместо secrets

---

## 📝 Полезные ссылки

- **GitHub Repository:** https://github.com/MaxOrel/deploy_ci_cd
- **GitHub Actions:** https://github.com/MaxOrel/deploy_ci_cd/actions
- **GitHub Secrets:** https://github.com/MaxOrel/deploy_ci_cd/settings/secrets/actions
- **GitHub Environments:** https://github.com/MaxOrel/deploy_ci_cd/settings/environments
- **Docker Hub:** https://hub.docker.com/u/maxorel

---

## ✅ Чеклист готовности

Отметьте, что уже сделано:

- [ ] Созданы репозитории в Docker Hub
- [ ] Созданы SSH ключи
- [ ] SSH ключи добавлены на серверы
- [ ] Все 30 секретов добавлены в GitHub
- [ ] Настроен staging environment
- [ ] Настроен production environment
- [ ] Staging сервер настроен (Docker + Nginx + SSL)
- [ ] Production сервер настроен (Docker + Nginx + SSL)
- [ ] Первый деплой прошел успешно

---

**Готово! 🎉 CI/CD настроен и работает!**
