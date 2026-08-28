import {syncDemoListingsToDatabase} from '../src/seed/demo/sync-demo-listings'

async function main(){
  await syncDemoListingsToDatabase()
}

main().then(()=>{
  process.stdout.write("Demo listings seeded successfully. \n")
}).catch((err)=>{
  process.stderr.write(
    `Seed failed: ${err instanceof Error ? err.message : String(err)}`
  );
  process.exitCode = 1
})