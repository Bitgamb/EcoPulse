begin;

create or replace function public.complete_eco_action(p_action_id uuid)
returns public.eco_actions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  completed_action public.eco_actions;
begin
  update public.eco_actions
  set completed = true,
      completed_at = now()
  where id = p_action_id
    and user_id = auth.uid()
    and completed = false
  returning * into completed_action;

  if completed_action.id is null then
    select * into completed_action
    from public.eco_actions
    where id = p_action_id and user_id = auth.uid();
    return completed_action;
  end if;

  update public.goals
  set current_progress = least(target_reduction, current_progress + completed_action.estimated_saving),
      status = case
        when current_progress + completed_action.estimated_saving >= target_reduction then 'completed'
        else status
      end
  where user_id = auth.uid()
    and status = 'active'
    and (category is null or category = completed_action.category);

  update public.user_stats
  set total_co2_saved = total_co2_saved + completed_action.estimated_saving,
      updated_at = now()
  where user_id = auth.uid();

  return completed_action;
end;
$$;

revoke all on function public.complete_eco_action(uuid) from public, anon;
grant execute on function public.complete_eco_action(uuid) to authenticated;

commit;
