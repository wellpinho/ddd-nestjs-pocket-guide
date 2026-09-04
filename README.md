# DDD com NestJS — Projeto Prático

Projeto prático que acompanha o e-book **DDD com NestJS — Guia de Bolso para Decisões Arquiteturais**, de Wellington Pinho.

A proposta é mostrar a evolução de um módulo de pedidos saindo de um CRUD acoplado até uma arquitetura com **Domain-Driven Design, Ports & Adapters, Clean Code, testes, idempotência, eventos e Outbox**.

> 📘 **Está acompanhando pelo e-book?**
>
> Faça um **Fork deste repositório antes de começar os exercícios**.
> Assim você poderá alterar, quebrar e experimentar o código livremente sem modificar o projeto original.
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

Este repositório foi criado para ser estudado, modificado e até quebrado.

A proposta não é apenas executar o código final.

Queremos que você experimente as decisões arquiteturais apresentadas no e-book.

Para isso, **não trabalhe diretamente no repositório original**.

Crie uma cópia na sua própria conta do GitHub utilizando um **Fork**.

## 1. Faça o Fork

No topo desta página no GitHub, clique em:

**Fork → Create fork**

O GitHub criará uma cópia deste projeto na sua conta.

```text
Repositório original

github.com/wellpinho/ddd-nestjs-pocket-guide

                ↓

               FORK

                ↓

Seu repositório

github.com/SEU-USUARIO/ddd-nestjs-pocket-guide
```

Agora você possui seu próprio ambiente para experimentar.

---

## 2. Clone o SEU Fork

Depois de criar o Fork, copie a URL do repositório que está na **sua conta**.

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

## 3. Crie uma branch para seus experimentos

Mesmo dentro do seu Fork, recomendamos criar uma branch para os exercícios.

```bash
git checkout -b meus-experimentos
```

Agora você pode:

- alterar regras;
- modificar Entities;
- criar novos Use Cases;
- experimentar outras arquiteturas;
- quebrar testes;
- corrigir os testes;
- substituir adapters;
- implementar novas regras de negócio.

Sem medo.

Esse é justamente o objetivo do laboratório.

---

## 4. Faça seus próprios commits

Depois de realizar algum experimento:

```bash
git add .
```

```bash
git commit -m "experiment: minha implementação"
```

Se quiser manter suas alterações no GitHub:

```bash
git push -u origin meus-experimentos
```

Esses commits serão enviados para **o seu Fork**.

O repositório original continuará intacto.

> Você não precisa abrir um Pull Request para concluir os exercícios do e-book.
>
> O Fork é seu ambiente pessoal de estudo e experimentação.

---

## 5. Quer recomeçar?

Algo quebrou?

Ótimo.

Parte da proposta deste projeto é justamente permitir que isso aconteça.

Você pode voltar para sua branch principal:

```bash
git checkout master
```

E criar outro experimento:

```bash
git checkout -b experimento-02
```

Você também pode comparar sua implementação com o código original.

A pergunta mais importante durante os exercícios não é:

> "Qual é a pasta correta?"

É:

> **"Por que essa responsabilidade deveria estar aqui?"**

---

# Laboratório: quebre o código

Depois que o projeto estiver funcionando, faça alguns experimentos.

### Experimento 1 — Desconto

Altere o desconto do cliente PREMIUM:

```text
10% → 5%
```

Execute os testes.

```bash
npm test
```

**Pergunta:** algum teste detectou a mudança?

---

### Experimento 2 — Regra de pagamento

Permita propositalmente:

```text
CANCELLED → PAID
```

Execute novamente:

```bash
npm test
```

**Pergunta:** qual teste protege essa regra?

---

### Experimento 3 — Gateway indisponível

Faça o `PaymentGateway` lançar:

```typescript
throw new Error('Gateway unavailable');
```

Observe o estado final do `Order`.

Ele deveria terminar como:

```text
PENDING
```

ou:

```text
PAID
```

Por quê?

---

### Experimento 4 — Idempotência

Remova a:

```text
idempotencyKey
```

Imagine agora duas requisições iguais:

```text
PATCH /orders/123/pay
PATCH /orders/123/pay
```

**Pergunta:** qual problema poderia acontecer em um gateway real?

---

### Experimento 5 — Outbox

Faça o `EventPublisher` falhar propositalmente.

Pergunte:

> O evento foi perdido?

Observe o comportamento da mensagem pendente no Outbox.

---

### Experimento 6 — Presentation

Retorne a `Order` diretamente pelo Controller, sem Presenter.

Depois altere a estrutura interna da Entity.

Pergunte:

> Meu contrato HTTP mudou sem que eu percebesse?

Esse é um dos motivos para separar:

```text
Domain Entity
      ↓
Presenter
      ↓
HTTP Response
```

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

Nesse exemplo, o subtotal é:

```text
2 × R$ 600,00 = R$ 1.200,00
```

Como o cliente é `PREMIUM` e o valor ultrapassa R$ 1.000,00, a `PricingPolicy` aplica a regra de desconto definida no domínio.

---

## Sobre o Outbox deste projeto

O projeto mantém o Outbox propositalmente simples e em memória.

O objetivo é deixar visível a separação entre:

```text
OrderPaidEvent
      ↓
Domain Event
      ↓
Integration Event
      ↓
Outbox
      ↓
Event Publisher
```

Em outras palavras:

1. acontece um fato no domínio: `OrderPaidEvent`;
2. esse fato precisa ser comunicado externamente;
3. criamos um contrato de integração: `orders.order-paid.v1`;
4. a mensagem é registrada no Outbox;
5. a infraestrutura tenta publicá-la;
6. em caso de falha, ela pode permanecer pendente para nova tentativa.

Em uma aplicação real:

```text
InMemoryOutboxRepository
```

provavelmente seria substituído por persistência transacional.

E:

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

O domínio não precisa conhecer nenhuma dessas tecnologias.

---

## Uma observação importante sobre arquitetura

Este projeto possui:

- DDD
- Ports & Adapters
- Domain Events
- Integration Events
- Outbox
- Idempotência
- Presenters

Isso **não significa que todo projeto precisa dessa estrutura**.

Um CRUD simples pode funcionar perfeitamente com:

```text
Controller
    ↓
Service
    ↓
Repository
```

Arquitetura tem custo.

Mais abstrações significam mais conceitos, arquivos, decisões e manutenção.

Não utilize DDD porque:

> "Essa é a arquitetura correta."

Utilize quando os problemas do sistema justificarem essas decisões.

> **A melhor arquitetura não é a que possui mais padrões. É a que torna as decisões importantes mais fáceis de entender, modificar e proteger.**

---

## Antes de terminar

Ao estudar cada parte do projeto, tente responder:

```text
Isso é regra de negócio?
        ↓
Domain

Isso coordena uma ação?
        ↓
Application

Preciso de uma capacidade externa?
        ↓
Port

Quem executa essa capacidade?
        ↓
Infrastructure

Como isso chega ou sai do sistema?
        ↓
Presentation

Como provo que a regra continua funcionando?
        ↓
Test
```

Se você começar a fazer essas perguntas naturalmente durante um Code Review, este projeto já cumpriu boa parte do seu objetivo.

---

## E-book

Este repositório acompanha o:

### DDD com NestJS

**Guia de Bolso para Decisões Arquiteturais**

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
