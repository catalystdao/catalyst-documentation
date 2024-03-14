<script lang="ts">
  export let content: { [header: string]: string };

  function capitalise(value: string): string {
    const parts = value.split("_");

    let workingString = "";
    for (const elem of parts) {
      workingString += elem[0]?.toUpperCase() + elem.slice(1);
    }
    return workingString;
  }

  const headers = ["Contract", "Address"];
  const rowHeaders = Object.keys(content);
  const rows = rowHeaders.map((rowHeader) => {
    return [capitalise(rowHeader), content[rowHeader]];
  });
</script>

<table>
  <thead>
    <tr>
      {#each headers as header}
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
