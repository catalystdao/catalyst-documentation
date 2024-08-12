<script lang="ts">
  import type { getOrdersEvent } from "./QuoteCommon";
  const API_URL = "https://catalyst-order-server-0140d799e2f7.herokuapp.com/";

  async function getOrders(): Promise<getOrdersEvent> {
    const orderServerResponse = await fetch(API_URL + "orders/");
    const fetchedOrders = (await orderServerResponse.json()) as getOrdersEvent;

    return fetchedOrders;
  }

  let request: undefined | Promise<getOrdersEvent> = undefined;
</script>

{#await request}
  <button disabled>Waiting</button>
{:then}
  <button
    on:click={() => {
      request = getOrders();
      console.log("hello");
    }}
  >
    getOrders()
  </button>
{/await}

{#if request !== undefined}
  {#await request then quotes}
    <div>{JSON.stringify(quotes)}</div>
  {/await}
{/if}
