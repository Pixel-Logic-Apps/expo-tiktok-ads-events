# expo-tiktok-ads-events

Módulo Expo para integração com o TikTok Business SDK, permitindo rastreamento de eventos para campanhas de anúncios do TikTok.

## Instalação

```bash
npm install expo-tiktok-ads-events
# ou
yarn add expo-tiktok-ads-events
```

### Configuração iOS

Adicione ao seu `ios/Podfile`:

```ruby
pod 'TikTokBusinessSDK'
```

Execute:
```bash
cd ios && pod install
```

### Permissões iOS

Adicione ao `Info.plist`:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>Este app rastreia sua atividade para melhorar a experiência com anúncios relevantes</string>
```

## Configuração

### Inicialização

```typescript
import TiktokAdsEvents from 'expo-tiktok-ads-events';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

// Solicitar permissão de rastreamento (iOS 14+)
const { status } = await requestTrackingPermissionsAsync();

// Inicializar SDK
await TiktokAdsEvents.initializeSdk(
  'YOUR_ACCESS_TOKEN',  // Token de acesso do TikTok Ads Manager
  'YOUR_APP_ID',        // ID do aplicativo
  'YOUR_TIKTOK_APP_ID'  // ID do app TikTok
);
```

## Uso

### Eventos Padrão

O módulo exporta todos os eventos padrão do TikTok:

```typescript
import TiktokAdsEvents, { TikTokStandardEvents } from 'expo-tiktok-ads-events';

// Rastrear evento sem propriedades
await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.launch_app);

// Rastrear evento com propriedades
await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.add_payment_info, [
  { key: 'currency', value: 'USD' },
  { key: 'value', value: 99.99 },
  { key: 'payment_method', value: 'credit_card' }
]);
```

#### Eventos Disponíveis

- `achieve_level` - Nível alcançado
- `add_payment_info` - Informações de pagamento adicionadas
- `complete_tutorial` - Tutorial concluído
- `create_group` - Grupo criado
- `create_role` - Função criada
- `generate_lead` - Lead gerado
- `in_app_ad_click` - Clique em anúncio no app
- `in_app_ad_impr` - Impressão de anúncio no app
- `install_app` - App instalado
- `join_group` - Entrou no grupo
- `launch_app` - App iniciado
- `loan_application` - Aplicação de empréstimo
- `loan_approval` - Aprovação de empréstimo
- `loan_disbursal` - Desembolso de empréstimo
- `login` - Login realizado
- `rate` - Avaliação
- `registration` - Registro
- `search` - Pesquisa
- `spend_credits` - Créditos gastos
- `start_trial` - Teste iniciado
- `subscribe` - Assinatura
- `unlock_achievement` - Conquista desbloqueada

### Eventos Customizados

```typescript
// Criar evento personalizado
await TiktokAdsEvents.trackCustomEvent(
  'custom_event_name',  // Nome do evento
  'EVENT_ID_123',       // ID único do evento
  [                     // Propriedades opcionais
    { key: 'category', value: 'gaming' },
    { key: 'score', value: 1500 }
  ]
);
```

### Identificação de Usuário

```typescript
import { TikTokIdentify } from 'expo-tiktok-ads-events';

// Identificar usuário
await TikTokIdentify({
  externalId: 'USER_123',
  externalUserName: 'João Silva',
  phoneNumber: '+5511999999999',
  email: 'joao@example.com'
});

// Ou usando o método direto
await TiktokAdsEvents.identify(
  'USER_123',           // ID externo (obrigatório)
  'João Silva',         // Nome (opcional)
  '+5511999999999',     // Telefone (opcional)
  'joao@example.com'    // Email (opcional)
);
```

### Funções Auxiliares

```typescript
import { TikTokLaunchApp } from 'expo-tiktok-ads-events';

// Helper para evento launch_app
await TikTokLaunchApp();

// Com propriedades
await TikTokLaunchApp([
  { key: 'source', value: 'notification' }
]);
```

### Informações de Debug

```typescript
// Obter ID anônimo do usuário
const anonymousId = await TiktokAdsEvents.getAnonymousID();

// Obter token de acesso atual
const accessToken = await TiktokAdsEvents.getAccessToken();

// Obter código de teste de eventos
const testEventCode = await TiktokAdsEvents.getTestEventCode();
```

## Exemplo Completo

```typescript
import { useEffect } from 'react';
import TiktokAdsEvents, { 
  TikTokLaunchApp, 
  TikTokIdentify,
  TikTokStandardEvents 
} from 'expo-tiktok-ads-events';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export default function App() {
  useEffect(() => {
    (async () => {
      // 1. Solicitar permissão de rastreamento
      const { status } = await requestTrackingPermissionsAsync();
      
      if (status === 'granted') {
        // 2. Inicializar SDK
        await TiktokAdsEvents.initializeSdk(
          'YOUR_ACCESS_TOKEN',
          'YOUR_APP_ID',
          'YOUR_TIKTOK_APP_ID'
        );
        
        // 3. Identificar usuário
        await TikTokIdentify({
          externalId: 'USER_123',
          email: 'user@example.com'
        });
        
        // 4. Rastrear lançamento do app
        await TikTokLaunchApp();
        
        // 5. Obter informações de debug
        const anonymousId = await TiktokAdsEvents.getAnonymousID();
        console.log('Anonymous ID:', anonymousId);
      }
    })();
  }, []);

  const handlePurchase = async () => {
    // Rastrear compra com propriedades
    await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.subscribe, [
      { key: 'currency', value: 'BRL' },
      { key: 'value', value: 29.90 },
      { key: 'content_type', value: 'subscription' },
      { key: 'content_id', value: 'plan_premium' }
    ]);
  };

  return (
    // Seu componente
  );
}
```

## Propriedades de Eventos

### Propriedades Comuns

- `currency` - Moeda (ex: "USD", "BRL")
- `value` - Valor monetário
- `content_type` - Tipo de conteúdo
- `content_id` - ID do conteúdo
- `content_name` - Nome do conteúdo
- `quantity` - Quantidade
- `description` - Descrição
- `query` - Termo de pesquisa
- `status` - Status

### Tipos TypeScript

```typescript
type EventProperty = {
  key: string;
  value: string | number;
};
```

## Testando Eventos

1. Obtenha o código de teste:
```typescript
const testCode = await TiktokAdsEvents.getTestEventCode();
console.log('Use este código no TikTok Events Manager:', testCode);
```

2. Acesse o [TikTok Events Manager](https://ads.tiktok.com/events_manager/)

3. Selecione seu pixel/app

4. Vá para "Test Events" 

5. Insira o código de teste

6. Execute eventos no app e veja em tempo real

## Configurações da SDK

A SDK é configurada automaticamente com:

- ✅ Rastreamento habilitado
- ✅ Rastreamento de lançamento habilitado  
- ✅ Rastreamento de retenção habilitado
- ✅ SKAdNetwork habilitado (iOS)
- ✅ Modo debug habilitado (desenvolvimento)

## Compatibilidade

- iOS 15.1+
- Android (em desenvolvimento)
- Expo SDK 54+

## Troubleshooting

### Eventos não aparecem no TikTok

1. Verifique se a permissão de rastreamento foi concedida (iOS)
2. Confirme que as credenciais estão corretas
3. Use o modo de teste para validar eventos
4. Aguarde até 24h para eventos aparecerem em produção

### ID anônimo vazio

O ID anônimo é gerado após a primeira inicialização bem-sucedida. Certifique-se de chamar `initializeSdk` antes.

### Erro de inicialização

Verifique:
- Token de acesso válido
- IDs corretos do aplicativo
- Conexão com internet

## Licença

MIT

## Autor

Bruno Verçosa - [Pixel Logic Apps](https://github.com/Pixel-Logic-Apps)

## Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## Links Úteis

- [TikTok for Business](https://business.tiktok.com/)
- [TikTok Ads Manager](https://ads.tiktok.com/)
- [TikTok Events API](https://business-api.tiktok.com/portal/docs)
- [Documentação Expo Modules](https://docs.expo.dev/modules/)
