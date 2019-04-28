$cont = Get-Content .\2_OopCodeHub\compiled.js -Raw
$abi = Get-Content .\bin\2_OopCodeHub\TenderSystem.abi -Raw
$bytecode = Get-Content .\bin\2_OopCodeHub\TenderSystem.bin -Raw

$res = $cont -replace "\[\[REPLACE_BYTECODE\]\]", $bytecode -replace "\[\[REPLACE_ABI\]\]", $abi
[System.IO.File]::WriteAllLines(".\bin\2_OopCodeHub\compiled.js", $res)
scp .\bin\2_OopCodeHub\compiled.js cj@172.16.12.92:~/Documents/Hackathon/proj/deploy/compiled.js
ssh cj@172.16.12.92 "cp ~/Documents/Hackathon/proj/deploy/compiled.js ~/Documents/Hackathon/proj/reacttest/src/contracts/compiled.js"
