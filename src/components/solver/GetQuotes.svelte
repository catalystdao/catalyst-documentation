<script lang="ts">
  import type { getOrdersEvent } from "./QuoteCommon";
  const API_URL = "https://catalyst-order-server-0140d799e2f7.herokuapp.com/";

  async function getOrders(): Promise<getOrdersEvent> {
    const orderServerResponse = await fetch(API_URL + "orders/", {
      method: "post",
    });
    const fetchedOrders = (await orderServerResponse.json()) as getOrdersEvent;

    return fetchedOrders;
  }

  let request: undefined | Promise<getOrdersEvent> = undefined;
</script>

<!-- <a
  style="font: inherit;align-items: flex-start;
  text-align: center;
  cursor: default;
  color: buttontext;
  padding-block-start: 2px;
  padding-block-end: 3px;
  padding-inline-start: 6px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 2px;
  border-top-style: outset;
  border-right-style: outset;
  border-bottom-style: outset;
  border-left-style: outset;
  border-top-color: buttonface;
  border-right-color: buttonface;
  border-bottom-color: buttonface;
  border-left-color: buttonface;
  background-color: buttonface;margin-top: 0em;
  color: initial;
  letter-spacing: normal;
  word-spacing: normal;
  line-height: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: start;"
  href={API_URL + "orders/"}
  target="_blank"
  rel="noopener noreferrer"
>
  getOrders()
</a> -->

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
