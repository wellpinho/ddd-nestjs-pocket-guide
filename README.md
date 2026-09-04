# DDD com NestJS — Projeto Prático

Projeto prático que acompanha o e-book **DDD com NestJS — Guia de Bolso para Decisões Arquiteturais**, de Wellington Pinho.

A proposta é mostrar a evolução de um módulo de pedidos saindo de um CRUD acoplado até uma arquitetura com **Domain-Driven Design, Ports & Adapters, Clean Code, testes, idempotência, eventos e Outbox**.

Este repositório funciona como material complementar ao e-book: você pode consultar a implementação final, executar os testes e, se quiser, modificar o código para explorar outras decisões arquiteturais.

> 📘 **Está acompanhando pelo e-book?**
>
> Você pode clonar este repositório apenas para consultar e executar o projeto.
>
> Se quiser **modificar o código e manter suas próprias alterações no GitHub**, recomendamos fazer um **Fork**. Assim você terá sua própria cópia para experimentar livremente.
>
> Veja [Como usar este projeto](#como-usar-este-projeto).

---

## Arquitetura final

```text
HTTP
 ↓
Presentation
 ↓
Application / Use Cases
 ↓
Domain
 ↓
Ports
 ↑
Infrastructure
```

O módulo `orders` contém:

```text
src/orders/
├── application/
│   ├── ports/
│   └── use-cases/
├── domain/
│   ├── errors/
│   ├── events/
│   ├── services/
│   ├── value-objects/
│   ├── order-item.ts
│   └── order.ts
├── infrastructure/
│   ├── messaging/
│   ├── payment/
│   └── repositories/
├── presentation/
│   └── http/
├── orders.controller.ts
└── orders.module.ts
```

---

## Conceitos demonstrados

- Entity e Aggregate Root
- Value Object `Money`
- Domain Service `PricingPolicy`
- Use Cases explícitos
- Repository Port
- Payment Gateway Port
- NestJS Dependency Injection
- Erros de domínio e tradução para HTTP
- Estado `PAYMENT_PROCESSING`
- Idempotência de pagamento
- Domain Event `OrderPaidEvent`
- Integration Event versionado
- Outbox em memória para fins didáticos
- Processamento e retry de mensagens pendentes
- Presenter HTTP para evitar vazamento da Entity
- Testes de domínio, aplicação, infraestrutura e E2E

---

## Fluxo de pagamento

```text
PENDING
   ↓
PAYMENT_PROCESSING
   ↓
PaymentGateway
   ↓
PAID
   ↓
OrderPaidEvent
   ↓
Outbox
   ↓
Integration Event
```

A chave de idempotência usada no gateway é determinística:

```text
pay-order:<orderId>
```

Isso evita uma nova cobrança lógica ao repetir a mesma operação no provedor.

> Em produção, a gravação do estado do Aggregate e a inserção da mensagem de Outbox devem ocorrer na **mesma transação do banco**.
>
> O adapter em memória deste projeto demonstra o padrão e o fluxo, mas não simula uma transação SQL real.

---

# Como usar este projeto

Existem duas formas simples de utilizar este repositório.

## Opção 1 — Apenas estudar e executar

Se você quer apenas acompanhar o código apresentado no e-book, executar a aplicação e rodar os testes, pode clonar este repositório diretamente:

```bash
git clone https://github.com/wellpinho/ddd-nestjs-pocket-guide.git
```

Entre na pasta:

```bash
cd ddd-nestjs-pocket-guide
```

Instale as dependências:

```bash
npm install
```

Pronto.

Você não precisa fazer Fork apenas para estudar ou executar o projeto localmente.

---

## Opção 2 — Quero modificar e experimentar

Se você pretende alterar regras, testar outras implementações ou manter suas próprias modificações no GitHub, recomendamos criar um **Fork**.

No topo da página do repositório, clique em:

**Fork → Create fork**

O GitHub criará uma cópia na sua conta:

```text
Repositório original

github.com/wellpinho/ddd-nestjs-pocket-guide

                ↓
               FORK
                ↓

Sua cópia

github.com/SEU-USUARIO/ddd-nestjs-pocket-guide
```

Agora clone **o seu Fork**:

```bash
git clone https://github.com/SEU-USUARIO/ddd-nestjs-pocket-guide.git
```

Entre no projeto:

```bash
cd ddd-nestjs-pocket-guide
```

Instale as dependências:

```bash
npm install
```

---

## Crie uma branch para seus experimentos

Se pretende modificar o projeto, uma boa prática é criar uma branch própria:

```bash
git checkout -b meus-experimentos
```

Agora você pode livremente:

- alterar regras de negócio;
- modificar Entities e Value Objects;
- testar outras implementações;
- substituir adapters;
- experimentar outros gateways;
- provocar falhas;
- modificar os testes;
- comparar diferentes soluções arquiteturais.

Se quiser salvar suas alterações:

```bash
git add .
git commit -m "experiment: minha implementação"
git push -u origin meus-experimentos
```

Esses commits serão enviados para **o seu Fork**, não para o repositório original.

> Não é necessário abrir Pull Request.
>
> O Fork serve como seu próprio ambiente para explorar e modificar o projeto.

---

## Experimentos opcionais

Você não precisa realizar os experimentos abaixo para acompanhar o e-book.

Eles existem apenas para quem quiser explorar o comportamento da aplicação e verificar, na prática, quais regras estão protegidas pela arquitetura e pelos testes.

### 1. Quebre uma regra de desconto

Altere:

```text
10% → 5%
```

Execute:

```bash
npm test
```

Observe quais testes detectam a alteração.

A pergunta aqui é:

> **Se uma regra importante mudar acidentalmente, algum teste fica vermelho?**

---

### 2. Permita uma transição inválida

Modifique temporariamente o domínio para permitir:

```text
CANCELLED → PAID
```

Execute novamente os testes.

Observe qual teste protege essa regra de negócio.

---

### 3. Simule uma falha no gateway

Faça o `PaymentGateway` lançar uma exceção:

```typescript
throw new Error('Gateway unavailable');
```

Observe o estado final do `Order`.

Esse experimento ajuda a visualizar por que a ordem das operações importa.

---

### 4. Remova a idempotência

Remova temporariamente:

```text
idempotencyKey
```

Agora imagine duas chamadas:

```text
PATCH /orders/123/pay
PATCH /orders/123/pay
```

Pergunte:

> O que poderia acontecer em um gateway de pagamento real?

---

### 5. Faça o publisher falhar

Provoque uma falha no `EventPublisher`.

Observe se a mensagem pendente desaparece ou continua disponível no Outbox.

Isso ajuda a visualizar o problema que o padrão Outbox tenta resolver.

---

### 6. Remova o Presenter

Retorne a `Order` diretamente pelo Controller.

Depois altere algum detalhe interno da Entity.

Observe o impacto sobre a resposta HTTP.

A ideia é visualizar por que:

```text
Domain Entity
      ↓
Presenter
      ↓
HTTP Response
```

pode ser uma separação útil.

---

## Executando

Inicie a aplicação:

```bash
npm run start:dev
```

Execute os testes:

```bash
npm test
```

Testes E2E:

```bash
npm run test:e2e
```

Build:

```bash
npm run build
```

---

## Endpoints

```text
POST   /orders
GET    /orders
GET    /orders/:id
PATCH  /orders/:id/pay
PATCH  /orders/:id/cancel
POST   /orders/outbox/process
```

### Exemplo de criação

```json
{
  "customerId": "customer-1",
  "customerType": "PREMIUM",
  "items": [
    {
      "productId": "keyboard-1",
      "name": "Mechanical Keyboard",
      "priceInCents": 60000,
      "quantity": 2
    }
  ]
}
```

Nesse exemplo:

```text
2 × R$ 600,00 = R$ 1.200,00
```

Como o cliente é `PREMIUM` e o subtotal ultrapassa R$ 1.000,00, a `PricingPolicy` aplica a regra de desconto definida no domínio.

---

## Sobre o Outbox deste projeto

O Outbox deste projeto é propositalmente simples e utiliza armazenamento em memória.

Seu objetivo é tornar visível a separação entre:

```text
Fato do domínio
      ↓
OrderPaidEvent
      ↓
Integration Event
      ↓
Outbox
      ↓
Event Publisher
```

O fluxo demonstra quatro responsabilidades diferentes:

1. o domínio registra que algo aconteceu;
2. esse fato é convertido em um contrato de integração;
3. a mensagem fica pendente no Outbox;
4. a infraestrutura realiza sua publicação.

Em uma aplicação real, o:

```text
InMemoryOutboxRepository
```

seria normalmente substituído por persistência transacional.

E o:

```text
InMemoryEventPublisher
```

poderia ser substituído por:

```text
RabbitMQ
Kafka
AWS SNS/SQS
ou outro broker
```

O ponto importante é que **o domínio não precisa conhecer nenhuma dessas tecnologias**.

---

## Não copie esta arquitetura cegamente

Este projeto demonstra:

```text
DDD
Ports & Adapters
Domain Events
Integration Events
Outbox
Idempotência
Presenters
```

Isso não significa que todo projeto precise dessa estrutura.

Um CRUD simples pode funcionar perfeitamente com:

```text
Controller
    ↓
Service
    ↓
Repository
```

Arquitetura possui custo.

Mais abstrações significam mais conceitos, arquivos, decisões e manutenção.

Portanto, não utilize DDD simplesmente porque:

> "Essa é a arquitetura correta."

Utilize ferramentas arquiteturais quando elas resolverem problemas reais do sistema.

> **A melhor arquitetura não é a que possui mais padrões. É a que torna as decisões importantes mais fáceis de entender, modificar e proteger.**

---

## Um mapa mental para levar com você

Ao analisar uma responsabilidade, pergunte:

```text
É uma regra do negócio?
        ↓
Domain

Coordena uma ação da aplicação?
        ↓
Application

Preciso abstrair uma capacidade?
        ↓
Port

Quem executa essa capacidade?
        ↓
Infrastructure

Como os dados entram ou saem?
        ↓
Presentation

Como provo que continua funcionando?
        ↓
Test
```

Mais importante do que decorar uma estrutura de pastas é conseguir responder:

> **Quem deveria ser responsável por isso?**

---

## E-book

Este projeto acompanha:

# DDD com NestJS

### Guia de Bolso para Decisões Arquiteturais

Um guia prático para situações como:

- Entity ou Use Case?
- Quando criar um Value Object?
- Quando usar Domain Service?
- Use Case pode chamar Use Case?
- Onde fica o Repository?
- Como lidar com serviços externos?
- Domain Event ou Integration Event?
- Quando Outbox faz sentido?
- Como identificar testes que passam mas não protegem?
- Como evitar Use Cases gigantes?
- Onde termina o domínio e começa a infraestrutura?

> **Do código que funciona ao código que continua funcionando quando o sistema cresce.**

Mais informações:

**www.wellpinho.com/ddd-nestjs**

---

## Autor

### Wellington Pinho

**Senior Backend Engineer • SaaS Founder**

Backend, arquitetura de software, NestJS, TypeScript, sistemas distribuídos, mensageria e testes automatizados.

**Site:** www.wellpinho.com  
**LinkedIn:** www.linkedin.com/in/wellpinho

---

## Licença

O código-fonte deste repositório é disponibilizado sob a licença **MIT**.

O conteúdo do e-book **DDD com NestJS — Guia de Bolso para Decisões Arquiteturais** não faz parte da licença MIT deste repositório.

© 2026 Wellington Pinho. Todos os direitos reservados.
