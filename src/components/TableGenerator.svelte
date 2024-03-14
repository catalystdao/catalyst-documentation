<script lang="ts">
  export let content:
    | { [header: string]: { [row: string]: string } }
    | { [header: string]: { [row: string]: { [lastKey: string]: string } } };
  export let lastKey: string = "";

  function onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }

  function capitalise(value: string): string {
    return (value[0]?.toUpperCase() + value.slice(1)).replace(
      "sepolia",
      "Sepolia",
    );
  }

  const headers: string[] = Object.keys(content);
  const rowHeaders = headers
    .flatMap((header) => Object.keys(content[header] ?? {}))
    .filter(onlyUnique);
  const rows = rowHeaders.map((rowHead) => {
    const row = headers.map((head) => {
      const contentLookup = (content[head] ?? {})[rowHead] ?? "";
      return typeof contentLookup === "string"
        ? contentLookup
        : contentLookup[lastKey] ?? "";
    });
    return [capitalise(rowHead), ...row];
  });
</script>

<table>
  <thead>
    <tr>
      {#each ["Chain", ...headers] as header}
        <th>
          <div>{header}</div>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        {#each row as cell}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
